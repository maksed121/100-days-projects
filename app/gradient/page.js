"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const GradientHeader = () => {
  const [count, setCount] = useState(20);
  const [type, setType] = useState("Linear");
  const [gradient, setGradient] = useState([]);

  const hexCodeGenerate = () => {
    const rgb = 255 * 255 * 255;
    const random = Math.floor(Math.random() * rgb);
    const hex = random.toString(16).padStart(6, "0");
    return `#${hex}`;
  };

  const handleCopy = (gradientItem) => {
    navigator.clipboard.writeText(gradientItem);
    toast.success("Gradient copied to clipboard ✅", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const gradientGenerate = () => {
    setGradient([]);
    for (let i = 0; i < count; i++) {
      if (type === "Linear") {
        const color1 = hexCodeGenerate();
        const color2 = hexCodeGenerate();
        const deg = Math.floor(Math.random() * 360);
        const gradientItem = `linear-gradient(${deg}deg, ${color1}, ${color2})`;
        setGradient((prev) => [...prev, gradientItem]);
      } else if (type === "Radial") {
        const color1 = hexCodeGenerate();
        const color2 = hexCodeGenerate();
        const gradientItem = `radial-gradient(circle, ${color1}, ${color2})`;
        setGradient((prev) => [...prev, gradientItem]);
      } else if (type === "Conic") {
        const slices = [];
        let lastPercent = 0;
        const sliceCount = Math.floor(Math.random() * 4) + 3; // 3–6 slices
        for (let j = 0; j < sliceCount; j++) {
          const color = hexCodeGenerate();
          const percent = lastPercent + Math.floor(Math.random() * 25) + 10; // random slice width
          lastPercent = percent > 100 ? 100 : percent;
          slices.push(`${color} ${lastPercent}%`);
        }
        const gradientItem = `conic-gradient(from ${Math.floor(
          Math.random() * 360
        )}deg, ${slices.join(", ")})`;
        setGradient((prev) => [...prev, gradientItem]);
      }
    }
  };

  useEffect(() => {
    gradientGenerate();
  }, [count, type]);

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎨</span>
          <h1 className="text-lg sm:text-xl font-bold whitespace-nowrap text-white">
            {type} Gradient Generator
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-20 px-2 py-2 text-white border rounded-md text-sm border-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-2 py-2 border border-white rounded-md text-sm text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>Linear</option>
            <option>Radial</option>
            <option>Conic</option>
          </select>

          <button
            onClick={gradientGenerate}
            className="px-16 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-rose-600 transition-colors"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:px-8 px-2 py-4">
        {gradient.map((item, index) => {
          return (
            <div
              style={{
                background: item,
              }}
              key={index}
              className="text-black text-sm px-2 py-1 rounded-md h-[180px]"
            >
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleCopy(item)}
                  className="px-2 py-1 mt-1 bg-zinc-900 font-bold text-white opacity-50 rounded-md text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ToastContainer />
    </div>
  );
};

export default GradientHeader;
