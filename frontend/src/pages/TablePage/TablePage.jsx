import { useNavigate } from 'react-router-dom'

function TablePage() {
  const navigate = useNavigate()
  const tableData = [
    { id: 1, name: 'Product A', category: 'Electronics', price: '₹25,000', stock: 150, status: 'Active' },
    { id: 2, name: 'Product B', category: 'Furniture', price: '₹15,000', stock: 80, status: 'Active' },
    { id: 3, name: 'Product C', category: 'Clothing', price: '₹5,000', stock: 200, status: 'Active' },
    { id: 4, name: 'Product D', category: 'Electronics', price: '₹35,000', stock: 50, status: 'Low Stock' },
    { id: 5, name: 'Product E', category: 'Books', price: '₹500', stock: 300, status: 'Active' },
    { id: 6, name: 'Product F', category: 'Sports', price: '₹8,000', stock: 120, status: 'Active' },
    { id: 7, name: 'Product G', category: 'Electronics', price: '₹45,000', stock: 30, status: 'Low Stock' },
    { id: 8, name: 'Product H', category: 'Home Decor', price: '₹12,000', stock: 90, status: 'Active' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Products List</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
              Add New Product
            </button>
          </div>

          <p className="text-gray-600 mb-4 text-sm">
            💡 Double click on any row to view detailed dashboard
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((item) => (
                  <tr
                    key={item.id}
                    onDoubleClick={() => navigate(`/dashboard/${item.id}`)}
                    className="hover:bg-blue-50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TablePage
