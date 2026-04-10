import ChatPage from '@/app/chat/page';

export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  return <ChatPage params={params} />;
}
