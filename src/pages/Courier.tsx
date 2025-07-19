export default function Courier() {
  return (
    <div className="w-screen h-screen bg-[#7a1212] flex items-center justify-center">
      <div className="bg-white text-center p-10 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-[#7a1212]">Courier Dashboard</h1>
        <p className="text-gray-700 my-4">Welcome to the courier interface!</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
          Start Delivery
        </button>
      </div>
    </div>
  );
}
