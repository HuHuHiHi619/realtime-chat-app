

function FeedLayout({ children }: any) {
  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div className="flex flex-col flex-auto flex-shrink-0 overflow-y-auto outline-4 outline-offset-2 outline-white rounded-2xl bg-brandCream-50 h-full p-4">
        {children}
      </div>
    </div>
  );
}

export default FeedLayout;
