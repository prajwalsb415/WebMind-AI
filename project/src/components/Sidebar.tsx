import { Layout, FileText, Globe, Store } from 'lucide-react';

const menuItems = [
  { icon: Layout, text: 'Page Builder', active: true },
  { icon: FileText, text: 'Service Pages' },
  { icon: Globe, text: 'Website Builder' },
  { icon: Store, text: 'Storefront' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              item.active
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span>{item.text}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;