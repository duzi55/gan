import { getAllPosts } from '@/lib/posts';
import { PostsArchive } from '@/components/blog/PostsArchive';

export const metadata = {
  title: '全部文章',
  description: '关于设计美学、前端工程与极简界面的全部笔记。',
};

export default function PostsPage() {
  const posts = getAllPosts();
  return <PostsArchive posts={posts} />;
}
