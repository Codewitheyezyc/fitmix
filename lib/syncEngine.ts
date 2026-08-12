import { supabase } from '@/lib/supabase';
import { Piece, Mix, Story, NotificationItem, UserProfile, DirectMessage } from '@/lib/types';

/**
 * FitMix Cloud Synchronization Engine
 * Handles bidirectional state syncing across user devices (Mobile <-> Desktop <-> Tablet)
 */

export interface CloudSyncData {
  pieces: Piece[];
  mixes: Mix[];
  stories: Story[];
  notifications: NotificationItem[];
  follows: { follower_id: string; following_id: string }[];
}

/**
 * Fetch all cloud pieces, mixes, stories, and follows from Supabase
 */
export async function fetchCloudData(): Promise<Partial<CloudSyncData>> {
  try {
    const [piecesRes, mixesRes, storiesRes, notifsRes, followsRes] = await Promise.all([
      supabase.from('pieces').select('*').order('created_at', { ascending: false }),
      supabase.from('mixes').select('*').order('created_at', { ascending: false }),
      supabase.from('stories').select('*').order('created_at', { ascending: false }),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('follows').select('*')
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

    return result;
  } catch (error) {
    console.warn('Cloud sync fetch notice:', error);
    return {};
  }
}

/**
 * Push a new garment piece to Supabase
 */
export async function cloudAddPiece(piece: Piece) {
  try {
    await supabase.from('pieces').upsert({
      id: piece.id,
      owner_id: piece.ownerId,
      owner_username: piece.ownerUsername,
      owner_name: piece.ownerName,
      owner_avatar: piece.ownerAvatar,
      title: piece.title,
      category: piece.category,
      cutout_image_url: piece.cutoutImageUrl,
      original_image_url: piece.originalImageUrl,
      brand_name: piece.brandName,
      dominant_colors: piece.dominantColors,
      description: piece.description,
      styling_notes: piece.stylingNotes,
      remix_count: piece.remixCount,
      likes_count: piece.likesCount,
      created_at: piece.createdAt
    });
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
    });
  } catch (err) {
    console.warn('Cloud add mix error:', err);
  }
}

/**
 * Push a new story to Supabase
 */
export async function cloudAddStory(story: Story) {
  try {
    await supabase.from('stories').upsert({
      id: story.id,
      user_id: story.userId,
      username: story.username,
      user_name: story.displayName,
      user_avatar: story.avatarUrl,
      media_url: story.imageUrl,
      caption: story.caption,
      created_at: story.createdAt,
      likes_count: story.likesCount || 0
    });
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
