export default function AdminFooter() {
  return (
    <footer
      className="py-6 mt-8"
      data-testid="admin-footer"
      role="contentinfo"
      style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-white/80">
        <div className="text-sm">© {new Date().getFullYear()} NYSC Jos North — Admin</div>
        <div className="text-sm">Admin tools and logs</div>
      </div>
    </footer>
  );
}
