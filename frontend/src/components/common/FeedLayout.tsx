function FeedLayout({ children }: any) {
  return (
    <div className="flex flex-col flex-auto h-screen p-6">
      <div className="flex flex-col diamond h-full flex-auto flex-shrink-0  overflow-y-auto border-2 border-brandCream-50 rounded-2xl shadow-layout p-4">
        {children}
      </div>
    </div>
  );
}

export default FeedLayout;
