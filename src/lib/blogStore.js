/**
 * Local blog post store using localStorage for persistence.
 * Replaces the base44 backend for blog post CRUD operations.
 */

const STORAGE_KEY = 'portfolio_blog_posts';

const generateId = () => `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const getBlogPosts = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveBlogPosts = (posts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const getBlogPostById = (id) => {
    return getBlogPosts().find(p => p.id === id) || null;
};

export const createBlogPost = (data) => {
    const posts = getBlogPosts();
    const post = {
        ...data,
        id: generateId(),
        created_date: new Date().toISOString(),
        views: 0,
    };
    saveBlogPosts([post, ...posts]);
    return Promise.resolve(post);
};

export const updateBlogPost = (id, data) => {
    const posts = getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return Promise.reject(new Error('Post not found'));
    posts[index] = { ...posts[index], ...data };
    saveBlogPosts(posts);
    return Promise.resolve(posts[index]);
};

export const deleteBlogPost = (id) => {
    const posts = getBlogPosts().filter(p => p.id !== id);
    saveBlogPosts(posts);
    return Promise.resolve();
};
