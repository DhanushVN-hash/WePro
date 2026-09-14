export default function ProductsOverview() {
  return (
    <section
      className="relative bg-fixed bg-cover bg-center py-20"
      style={{
        backgroundImage:
          "url('https://static.wixstatic.com/media/db8665_0447a85e15f540a2b79858daa4ea7ff1~mv2.png/v1/fill/w_1858,h_899,al_c,q_90,usm_1.20_1.00_0.01,enc_avif,quality_auto/db8665_0447a85e15f540a2b79858daa4ea7ff1~mv2.png')",
      }}
    >
      <div className="absolute inset-0 bg-white/30"></div> 

      <div className="relative mx-auto max-w-6xl px-6 text-center text-white">
        <h2 className="text-5xl font-bold text-yellow-400">
          OUR PRODUCTS
        </h2>

        <p className="mt-4 text-lg">
          Discover our comprehensive and specialized selection of nailers and
          staplers.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-black/60 p-10 transition hover:bg-black/70">
            <h3 className="mb-4 text-3xl font-bold">BY TYPE</h3>
            <p>
              Choose your tool by fastener length, thickness and collation.
            </p>
          </div>

          <div className="rounded-lg bg-black/60 p-10 transition hover:bg-black/70">
            <h3 className="mb-4 text-3xl font-bold">BY APPLICATION</h3>
            <p>Choose your tool by intended jobs and applications.</p>
          </div>
        </div>
      </div>
    </section>
  );
}