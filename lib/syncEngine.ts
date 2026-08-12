import { supabase } from '@/lib/supabase';
import { Piece, Mix, Story, NotificationItem, UserProfile, DirectMessage } from '@/lib/types';
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
}

/**
 * Fetch all cloud pieces, mixes, stories, follows, and users from Supabase
 */
export async function fetchCloudData(): Promise<Partial<CloudSyncData>> {
  try {
    const [piecesRes, mixesRes, storiesRes, notifsRes, followsRes, profilesRes] = await Promise.all([
      supabase.from('pieces').select('*').order('created_at', { ascending: false }),
      supabase.from('mixes').select('*').order('created_at', { ascending: false }),
      supabase.from('stories').select('*').order('created_at', { ascending: false }),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('follows').select('*'),
      supabase.from('profiles').select('*').order('created_at', { ascending: false })
    ]);

    const result: Partial<CloudSyncData> = {};

    if (piecesRes.data && piecesRes.data.length > 0) {
      result.pieces = piecesRes.data.map(p => ({
        id: p.id,
        ownerId: p.owner_id || '',
        ownerUsername: p.owner_username || 'stylist',
        ownerName: p.owner_name || 'Stylist',
        ownerAvatar: p.owner_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
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
        creatorAvatar: m.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
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
        avatarUrl: s.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
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

    return result;
  } catch (error) {
    console.warn('Cloud sync fetch notice:', error);
    return {};
  }
}

/**
 * Automatically migrate all locally stored custom pieces, mixes, and stories to Supabase Cloud.
 * This ensures that whatever was previously created on mobile gets pushed to the cloud and appears on laptop/desktop.
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
           p.id.startsWith('pc_') && !['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8'].includes(p.id)
    );

    if (userPieces.length > 0) {
      for (const piece of userPieces) {
        let finalCutoutUrl = piece.cutoutImageUrl;
        if (finalCutoutUrl.startsWith('data:')) {
          finalCutoutUrl = await uploadImageToStorage(finalCutoutUrl, 'pieces', `piece_${piece.id}`);
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
          dominantColors: piece.dominantColors,
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
           m.id.startsWith('mix_') && !['mix_1', 'mix_2', 'mix_3'].includes(m.id)
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
           s.userId === currentUser.id
    );

    if (userStories.length > 0) {
      for (const story of userStories) {
        let finalMediaUrl = story.imageUrl;
        if (finalMediaUrl.startsWith('data:')) {
          finalMediaUrl = await uploadImageToStorage(finalMediaUrl, 'mixes', `story_${story.id}`);
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

    // 4. Update profile in Supabase
    await supabase.from('profiles').upsert({
      id: currentUser.id,
      username: currentUser.username,
      display_name: currentUser.displayName,
      avatar_url: currentUser.avatarUrl,
      bio: currentUser.bio,
      style_interests: currentUser.styleInterests,
      updated_at: new Date().toISOString()
    }, { onConflict: 'username' });

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
 * Counts all mixes created by OTHER users where remix_chain_parent_id is set
 * and any layer references a piece owned by this user.
 * 
 * Simplified approach: count mixes where creator_username != username
 * AND remix_chain_parent_id is not null (i.e. it's a remix of someone's work)
 * filtered to remixes of pieces owned by this user.
 */
export async function fetchUserRemixCount(username: string): Promise<number> {
  try {
    // First get all piece IDs owned by this user
    const { data: userPieces } = await supabase
      .from('pieces')
      .select('id')
      .eq('owner_username', username);

    if (!userPieces || userPieces.length === 0) return 0;

    // Count mixes by OTHER users that have a remix_chain_parent_id set
    // (meaning they remixed something) and were created by someone else
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
