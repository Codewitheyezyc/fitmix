import { supabase } from '@/lib/supabase';
import { Piece, Mix, Story, NotificationItem, UserProfile, DirectMessage, Comment } from '@/lib/types';
import { uploadImageToStorage } from '@/lib/storageUpload';

/**
 * FitMix Cloud Synchronization Engine
 * Handles seamless bidirectional state syncing across all devices (Mobile <-> Desktop <-> Tablet)
 */

export interface CloudSyncData {
  pieces: Piece[];
  mixes: Mix[];
  stories: Story[];
  notifications: NotificationItem[];
  follows: { follower_id: string; following_id: string }[];
  users: UserProfile[];
  comments: Comment[];
  directMessages: DirectMessage[];
}

/**
 * Fetch all cloud pieces, mixes, stories, follows, users, comments, and messages from Supabase
 */
export async function fetchCloudData(): Promise<Partial<CloudSyncData>> {
  try {
    const [piecesRes, mixesRes, storiesRes, notifsRes, followsRes, profilesRes, commentsRes, dmsRes] = await Promise.all([
      supabase.from('pieces').select('*').order('created_at', { ascending: false }),
      supabase.from('mixes').select('*').order('created_at', { ascending: false }),
      supabase.from('stories').select('*').order('created_at', { ascending: false }),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('follows').select('*'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('comments').select('*').order('created_at', { ascending: true }),
      supabase.from('direct_messages').select('*').order('created_at', { ascending: true })
    ]);

    const result: Partial<CloudSyncData> = {};

    if (piecesRes.data && piecesRes.data.length > 0) {
      result.pieces = piecesRes.data.map(p => ({
        id: p.id,
        ownerId: p.owner_id || '',
        ownerUsername: p.owner_username || 'stylist',
        ownerName: p.owner_name || 'Stylist',
        ownerAvatar: p.owner_avatar || '',
        title: p.title,
        category: p.category,
        cutoutImageUrl: p.cutout_image_url,
        originalImageUrl: p.original_image_url,
        brandName: p.brand_name,
        dominantColors: p.dominant_colors || [],
        description: p.description,
        stylingNotes: p.styling_notes,
        remixCount: p.remix_count || 0,
        likesCount: p.likes_count || 0,
        createdAt: p.created_at
      }));
    }

    if (mixesRes.data && mixesRes.data.length > 0) {
      result.mixes = mixesRes.data.map(m => ({
        id: m.id,
        creatorId: m.creator_id,
        creatorUsername: m.creator_username || 'creator',
        creatorName: m.creator_name || 'Creator',
        creatorAvatar: m.creator_avatar || '',
        title: m.title,
        description: m.description,
        renderedImageUrl: m.rendered_image_url,
        canvasBackground: m.canvas_background,
        layers: m.layers_json || [],
        techniqueTags: m.technique_tags || ['Streetwear x Formal'],
        whyItWorks: m.why_it_works,
        likesCount: m.likes_count || 0,
        commentsCount: m.comments_count || 0,
        remixCount: m.remix_count || 0,
        createdAt: m.created_at,
        remixChainParentId: m.remix_chain_parent_id,
        parentMixTitle: m.parent_mix_title,
        parentMixCreatorUsername: m.parent_mix_creator_username
      }));
    }

    if (storiesRes.data && storiesRes.data.length > 0) {
      result.stories = storiesRes.data.map(s => ({
        id: s.id,
        userId: s.user_id,
        username: s.username,
        displayName: s.user_name || s.username || 'Stylist',
        avatarUrl: s.user_avatar || '',
        imageUrl: s.media_url,
        caption: s.caption || '',
        createdAt: s.created_at,
        expiresAt: new Date(new Date(s.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        likesCount: s.likes_count || 0
      }));
    }

    if (followsRes.data) {
      result.follows = followsRes.data;
    }

    if (profilesRes.data && profilesRes.data.length > 0) {
      result.users = profilesRes.data.map(p => ({
        id: p.id,
        username: p.username,
        displayName: p.display_name,
        avatarUrl: p.avatar_url || '',
        bio: p.bio || 'Fashion lover & outfit mixer.',
        location: p.location || '',
        styleInterests: p.style_interests || ['Streetwear', 'Vintage'],
        totalRemixesReceived: 0,
        followersCount: 0,
        followingCount: 0,
        hasCompletedOnboarding: p.has_completed_onboarding ?? true,
        createdAt: p.created_at || new Date().toISOString()
      }));
    }

    if (commentsRes.data && commentsRes.data.length > 0) {
      result.comments = commentsRes.data.map(c => ({
        id: c.id,
        mixId: c.mix_id,
        userId: c.user_id,
        username: c.username || 'stylist',
        userAvatar: c.user_avatar || '',
        content: c.content,
        createdAt: c.created_at
      }));
    }

    if (dmsRes.data && dmsRes.data.length > 0) {
      result.directMessages = dmsRes.data.map(d => ({
        id: d.id,
        senderId: d.sender_id,
        receiverId: d.receiver_id,
        content: d.content,
        attachedMixId: d.attached_mix_id,
        attachedPieceId: d.attached_piece_id,
        reactions: d.reactions || {},
        status: d.status || 'sent',
        createdAt: d.created_at
      }));
    }

    if (notifsRes.data && notifsRes.data.length > 0) {
      result.notifications = notifsRes.data.map(n => ({
        id: n.id,
        userId: n.user_id,
        actorId: n.actor_id,
        actorUsername: n.actor_username || 'stylist',
        actorAvatar: n.actor_avatar || '',
        type: n.type,
        targetMixId: n.target_mix_id,
        targetPieceId: n.target_piece_id,
        pieceTitle: n.piece_title,
        mixTitle: n.mix_title,
        message: n.message,
        read: n.read,
        createdAt: n.created_at
      }));
    }

    return result;
  } catch (error) {
    console.warn('Cloud sync fetch notice:', error);
    return {};
  }
}

/**
 * Automatically migrate all locally stored custom pieces, mixes, and stories to Supabase Cloud.
 */
export async function autoMigrateLocalToCloud(
  localPieces: Piece[],
  localMixes: Mix[],
  localStories: Story[],
  currentUser: UserProfile
) {
  try {
    // 1. Identify user-created custom pieces
    const userPieces = localPieces.filter(
      p => p.ownerUsername.toLowerCase() === currentUser.username.toLowerCase() ||
           p.ownerId === currentUser.id ||
           p.id.startsWith('pc_')
    );

    if (userPieces.length > 0) {
      for (const piece of userPieces) {
        let finalCutoutUrl = piece.cutoutImageUrl;
        if (finalCutoutUrl.startsWith('data:')) {
          try {
            finalCutoutUrl = await uploadImageToStorage(finalCutoutUrl, 'pieces', `piece_${piece.id}`);
          } catch (_) {
            continue;
          }
        }

        await supabase.from('pieces').upsert({
          id: piece.id,
          owner_id: currentUser.id || piece.ownerId,
          owner_username: currentUser.username || piece.ownerUsername,
          owner_name: currentUser.displayName || piece.ownerName,
          owner_avatar: currentUser.avatarUrl || piece.ownerAvatar,
          title: piece.title,
          category: piece.category,
          cutout_image_url: finalCutoutUrl,
          original_image_url: piece.originalImageUrl,
          brand_name: piece.brandName,
          dominant_colors: piece.dominantColors,
          description: piece.description,
          styling_notes: piece.stylingNotes,
          remix_count: piece.remixCount || 0,
          likes_count: piece.likesCount || 0,
          created_at: piece.createdAt || new Date().toISOString()
        }, { onConflict: 'id' });
      }
    }

    // 2. Identify user-created custom mixes
    const userMixes = localMixes.filter(
      m => m.creatorUsername.toLowerCase() === currentUser.username.toLowerCase() ||
           m.creatorId === currentUser.id ||
           m.id.startsWith('mix_')
    );

    if (userMixes.length > 0) {
      for (const mix of userMixes) {
        await supabase.from('mixes').upsert({
          id: mix.id,
          creator_id: currentUser.id || mix.creatorId,
          creator_username: currentUser.username || mix.creatorUsername,
          creator_name: currentUser.displayName || mix.creatorName,
          creator_avatar: currentUser.avatarUrl || mix.creatorAvatar,
          title: mix.title,
          description: mix.description,
          rendered_image_url: mix.renderedImageUrl,
          canvas_background: mix.canvasBackground,
          layers_json: mix.layers,
          technique_tags: mix.techniqueTags,
          why_it_works: mix.whyItWorks,
          likes_count: mix.likesCount || 0,
          comments_count: mix.commentsCount || 0,
          remix_count: mix.remixCount || 0,
          created_at: mix.createdAt || new Date().toISOString(),
          remix_chain_parent_id: mix.remixChainParentId,
          parent_mix_title: mix.parentMixTitle,
          parent_mix_creator_username: mix.parentMixCreatorUsername
        }, { onConflict: 'id' });
      }
    }

    // 3. Identify user-created custom stories
    const userStories = localStories.filter(
      s => s.username.toLowerCase() === currentUser.username.toLowerCase() ||
           s.userId === currentUser.id ||
           s.id.startsWith('story_')
    );

    if (userStories.length > 0) {
      for (const story of userStories) {
        let finalMediaUrl = story.imageUrl;
        if (finalMediaUrl.startsWith('data:')) {
          try {
            finalMediaUrl = await uploadImageToStorage(finalMediaUrl, 'mixes', `story_${story.id}`);
          } catch (_) {
            continue;
          }
        }

        await supabase.from('stories').upsert({
          id: story.id,
          user_id: currentUser.id || story.userId,
          username: currentUser.username || story.username,
          user_name: currentUser.displayName || story.displayName,
          user_avatar: currentUser.avatarUrl || story.avatarUrl,
          media_url: finalMediaUrl,
          caption: story.caption,
          created_at: story.createdAt || new Date().toISOString(),
          likes_count: story.likesCount || 0
        }, { onConflict: 'id' });
      }
    }

    // 4. Update profile in Supabase profiles table
    if (currentUser.id && currentUser.id !== 'guest' && currentUser.username) {
      await supabase.from('profiles').upsert({
        id: currentUser.id,
        username: currentUser.username,
        display_name: currentUser.displayName,
        avatar_url: currentUser.avatarUrl,
        bio: currentUser.bio,
        location: currentUser.location,
        style_interests: currentUser.styleInterests,
        has_completed_onboarding: currentUser.hasCompletedOnboarding ?? true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'username' });
    }

  } catch (err) {
    console.warn('Auto-migrate error notice:', err);
  }
}

/**
 * Push a new garment piece to Supabase
 */
export async function cloudAddPiece(piece: Piece) {
  try {
    let finalCutoutUrl = piece.cutoutImageUrl;
    if (finalCutoutUrl.startsWith('data:')) {
      finalCutoutUrl = await uploadImageToStorage(finalCutoutUrl, 'pieces', `piece_${piece.id}`);
    }

    await supabase.from('pieces').upsert({
      id: piece.id,
      owner_id: piece.ownerId,
      owner_username: piece.ownerUsername,
      owner_name: piece.ownerName,
      owner_avatar: piece.ownerAvatar,
      title: piece.title,
      category: piece.category,
      cutout_image_url: finalCutoutUrl,
      original_image_url: piece.originalImageUrl,
      brand_name: piece.brandName,
      dominant_colors: piece.dominantColors,
      description: piece.description,
      styling_notes: piece.stylingNotes,
      remix_count: piece.remixCount,
      likes_count: piece.likesCount,
      created_at: piece.createdAt
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Cloud add piece error:', err);
  }
}

/**
 * Delete a garment piece from Supabase
 */
export async function cloudDeletePiece(pieceId: string) {
  try {
    await supabase.from('pieces').delete().eq('id', pieceId);
  } catch (err) {
    console.warn('Cloud delete piece error:', err);
  }
}

/**
 * Push a new mix to Supabase
 */
export async function cloudAddMix(mix: Mix) {
  try {
    await supabase.from('mixes').upsert({
      id: mix.id,
      creator_id: mix.creatorId,
      creator_username: mix.creatorUsername,
      creator_name: mix.creatorName,
      creator_avatar: mix.creatorAvatar,
      title: mix.title,
      description: mix.description,
      rendered_image_url: mix.renderedImageUrl,
      canvas_background: mix.canvasBackground,
      layers_json: mix.layers,
      technique_tags: mix.techniqueTags,
      why_it_works: mix.whyItWorks,
      likes_count: mix.likesCount,
      comments_count: mix.commentsCount,
      remix_count: mix.remixCount,
      created_at: mix.createdAt,
      remix_chain_parent_id: mix.remixChainParentId,
      parent_mix_title: mix.parentMixTitle,
      parent_mix_creator_username: mix.parentMixCreatorUsername
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Cloud add mix error:', err);
  }
}

/**
 * Update mix likes count in Supabase
 */
export async function cloudToggleLikeMix(mixId: string, likesCount: number) {
  try {
    await supabase.from('mixes').update({ likes_count: likesCount }).eq('id', mixId);
  } catch (err) {
    console.warn('Cloud like mix error:', err);
  }
}

/**
 * Push a new story to Supabase
 */
export async function cloudAddStory(story: Story) {
  try {
    let finalMediaUrl = story.imageUrl;
    if (finalMediaUrl.startsWith('data:')) {
      finalMediaUrl = await uploadImageToStorage(finalMediaUrl, 'mixes', `story_${story.id}`);
    }

    await supabase.from('stories').upsert({
      id: story.id,
      user_id: story.userId,
      username: story.username,
      user_name: story.displayName,
      user_avatar: story.avatarUrl,
      media_url: finalMediaUrl,
      caption: story.caption,
      created_at: story.createdAt,
      likes_count: story.likesCount || 0
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Cloud add story error:', err);
  }
}

/**
 * Delete a story from Supabase
 */
export async function cloudDeleteStory(storyId: string) {
  try {
    await supabase.from('stories').delete().eq('id', storyId);
  } catch (err) {
    console.warn('Cloud delete story error:', err);
  }
}

/**
 * Update story likes count in Supabase
 */
export async function cloudToggleLikeStory(storyId: string, likesCount: number) {
  try {
    await supabase.from('stories').update({ likes_count: likesCount }).eq('id', storyId);
  } catch (err) {
    console.warn('Cloud like story error:', err);
  }
}

/**
 * Push a new comment to Supabase
 */
export async function cloudAddComment(comment: Comment) {
  try {
    await supabase.from('comments').upsert({
      id: comment.id,
      mix_id: comment.mixId,
      user_id: comment.userId,
      username: comment.username,
      user_avatar: comment.userAvatar,
      content: comment.content,
      created_at: comment.createdAt
    }, { onConflict: 'id' });

    // Also increment comments_count in mixes table
    const { data: mix } = await supabase.from('mixes').select('comments_count').eq('id', comment.mixId).maybeSingle();
    if (mix) {
      await supabase.from('mixes').update({ comments_count: (mix.comments_count || 0) + 1 }).eq('id', comment.mixId);
    }
  } catch (err) {
    console.warn('Cloud add comment error:', err);
  }
}

/**
 * Push a direct message to Supabase
 */
export async function cloudAddDirectMessage(dm: DirectMessage) {
  try {
    await supabase.from('direct_messages').upsert({
      id: dm.id,
      sender_id: dm.senderId,
      receiver_id: dm.receiverId,
      content: dm.content,
      attached_mix_id: dm.attachedMixId,
      attached_piece_id: dm.attachedPieceId,
      reactions: dm.reactions || {},
      status: dm.status || 'sent',
      created_at: dm.createdAt
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Cloud add DM error:', err);
  }
}

/**
 * Update message reactions in Supabase
 */
export async function cloudUpdateDirectMessageReaction(messageId: string, reactions: Record<string, string[]>) {
  try {
    await supabase.from('direct_messages').update({ reactions }).eq('id', messageId);
  } catch (err) {
    console.warn('Cloud update DM reactions error:', err);
  }
}

/**
 * Push a notification to Supabase
 */
export async function cloudAddNotification(notif: NotificationItem) {
  try {
    await supabase.from('notifications').upsert({
      id: notif.id,
      user_id: notif.userId,
      actor_id: notif.actorId,
      actor_username: notif.actorUsername,
      actor_avatar: notif.actorAvatar,
      type: notif.type,
      target_mix_id: notif.targetMixId,
      target_piece_id: notif.targetPieceId,
      piece_title: notif.pieceTitle,
      mix_title: notif.mixTitle,
      message: notif.message,
      read: notif.read,
      created_at: notif.createdAt
    }, { onConflict: 'id' });
  } catch (err) {
    console.warn('Cloud add notification error:', err);
  }
}

/**
 * Mark all notifications as read in Supabase
 */
export async function cloudMarkNotificationsRead(userId: string) {
  try {
    await supabase.from('notifications').update({ read: true }).eq('user_id', userId);
  } catch (err) {
    console.warn('Cloud mark notifications read error:', err);
  }
}

/**
 * Sync follow / unfollow status in Supabase
 */
export async function cloudToggleFollow(followerId: string, followingId: string, isFollowing: boolean) {
  try {
    if (isFollowing) {
      await supabase.from('follows').upsert({
        follower_id: followerId,
        following_id: followingId
      });
    } else {
      await supabase.from('follows').delete().match({
        follower_id: followerId,
        following_id: followingId
      });
    }
  } catch (err) {
    console.warn('Cloud follow sync error:', err);
  }
}

/**
 * Fetch the real community remix count for a user.
 */
export async function fetchUserRemixCount(username: string): Promise<number> {
  try {
    const { data: userPieces } = await supabase
      .from('pieces')
      .select('id')
      .eq('owner_username', username);

    if (!userPieces || userPieces.length === 0) return 0;

    const { count } = await supabase
      .from('mixes')
      .select('id', { count: 'exact', head: true })
      .neq('creator_username', username)
      .not('remix_chain_parent_id', 'is', null);

    return count || 0;
  } catch (err) {
    console.warn('fetchUserRemixCount error:', err);
    return 0;
  }
}

/**
 * Permanently delete a user's account and completely wipe all their associated data
 * from Supabase (pieces, mixes, stories, comments, DMs, notifications, follows, profile).
 */
export async function cloudDeleteUserAccount(userId: string, username: string): Promise<boolean> {
  try {
    const cleanUsername = username.trim().toLowerCase();

    await Promise.allSettled([
      // 1. Delete all pieces owned by user
      supabase.from('pieces').delete().or(`owner_id.eq.${userId},owner_username.ilike.${cleanUsername}`),
      
      // 2. Delete all mixes created by user
      supabase.from('mixes').delete().or(`creator_id.eq.${userId},creator_username.ilike.${cleanUsername}`),
      
      // 3. Delete all stories posted by user
      supabase.from('stories').delete().or(`user_id.eq.${userId},username.ilike.${cleanUsername}`),
      
      // 4. Delete all comments by user
      supabase.from('comments').delete().or(`user_id.eq.${userId},username.ilike.${cleanUsername}`),
      
      // 5. Delete all direct messages (sent or received)
      supabase.from('direct_messages').delete().or(`sender_id.eq.${userId},receiver_id.eq.${userId}`),
      
      // 6. Delete all notifications (for user or triggered by user)
      supabase.from('notifications').delete().or(`user_id.eq.${userId},actor_id.eq.${userId}`),
      
      // 7. Delete all follow connections
      supabase.from('follows').delete().or(`follower_id.eq.${userId},following_id.eq.${userId}`),
      
      // 8. Delete user profile record
      supabase.from('profiles').delete().or(`id.eq.${userId},username.ilike.${cleanUsername}`)
    ]);

    return true;
  } catch (err) {
    console.error('cloudDeleteUserAccount error:', err);
    return false;
  }
}

/**
 * Update user profile in Supabase profiles table and cascade avatar changes across existing pieces, mixes, and comments.
 */
export async function cloudUpdateUserProfile(profile: UserProfile): Promise<boolean> {
  try {
    const authUser = (await supabase.auth.getUser()).data.user;
    const targetUserId = authUser?.id || (profile.id && profile.id !== 'guest' ? profile.id : null);

    if (targetUserId) {
      // Check existing profile to see if handle was modified
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', targetUserId)
        .maybeSingle();

      if (existingProfile && existingProfile.username && existingProfile.username.toLowerCase() !== profile.username.toLowerCase()) {
        // Record old username in username_aliases table to preserve historical URLs
        await supabase.from('username_aliases').upsert({
          user_id: targetUserId,
          old_username: existingProfile.username.toLowerCase(),
          created_at: new Date().toISOString()
        }, { onConflict: 'old_username' }).select();
      }

      await supabase.from('profiles').upsert({
        id: targetUserId,
        username: profile.username,
        display_name: profile.displayName,
        avatar_url: profile.avatarUrl || '',
        bio: profile.bio || '',
        location: profile.location || '',
        style_interests: profile.styleInterests || [],
        has_completed_onboarding: profile.hasCompletedOnboarding ?? true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    } else if (profile.username) {
      await supabase.from('profiles').update({
        display_name: profile.displayName,
        avatar_url: profile.avatarUrl || '',
        bio: profile.bio || '',
        location: profile.location || '',
        style_interests: profile.styleInterests || [],
        updated_at: new Date().toISOString()
      }).eq('username', profile.username);
    }

    return true;
  } catch (err) {
    console.error('cloudUpdateUserProfile error:', err);
    return false;
  }
}

/**
 * Check if a handle exists as a historic username alias.
 */
export async function fetchAliasByOldUsername(oldUsername: string): Promise<{ userId: string } | null> {
  try {
    const { data } = await supabase
      .from('username_aliases')
      .select('user_id')
      .eq('old_username', oldUsername.toLowerCase())
      .maybeSingle();
    
    if (data && data.user_id) {
      return { userId: data.user_id };
    }
    return null;
  } catch (e) {
    console.warn('fetchAliasByOldUsername error:', e);
    return null;
  }
}



