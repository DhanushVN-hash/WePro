export default function ProductsOverview() {
  return (
    <section
      className="relative py-20 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://static.wixstatic.com/media/db8665_0447a85e15f540a2b79858daa4ea7ff1~mv2.png/v1/fill/w_1858,h_899,al_c,q_90,usm_1.20_1.00_0.01,enc_avif,quality_auto/db8665_0447a85e15f540a2b79858daa4ea7ff1~mv2.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
        <h2 className="text-5xl font-bold text-yellow-400">
          OUR PRODUCTS
        </h2>

        <p className="mt-4 text-lg">
          Discover our comprehensive and specialized selection of nailers and
          staplers.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-14">
          <div className="bg-black/60 p-10 rounded-lg hover:bg-black/70 transition">
            <h3 className="text-3xl font-bold mb-4">BY TYPE</h3>
            <p>
              Choose your tool by fastener length, thickness and collation.
            </p>
          </div>

          <div className="bg-black/60 p-10 rounded-lg hover:bg-black/70 transition">
            <h3 className="text-3xl font-bold mb-4">
              BY APPLICATION
            </h3>
            <p>
              Choose your tool by intended jobs and applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}