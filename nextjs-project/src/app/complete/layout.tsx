import '../globals.css';

export default function CompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="complete-page-layout">
      {children}
    </div>
  );
}
