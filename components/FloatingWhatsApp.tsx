export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/7338883738?text=Hi%20I'm%20interested%20in%20your%20products."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="
        group
        fixed bottom-6 right-6 z-50
        flex items-center
      "
    >
      {/* Tooltip — desktop only, appears on hover */}
      <span
        className="
          pointer-events-none
          mr-3 hidden whitespace-nowrap
          rounded-full bg-neutral-900
          px-3.5 py-2
          text-sm font-medium text-white
          opacity-0 shadow-lg
          transition-all duration-200
          group-hover:opacity-100
          sm:block
          translate-x-2 group-hover:translate-x-0
        "
      >
        Chat with us
      </span>

      {/* Ambient pulse ring drawing the eye without being annoying */}
      <span
        className="
          absolute inset-0
          rounded-full
          bg-[#25D366]
          opacity-60
          animate-ping
          [animation-duration:2.5s]
        "
        aria-hidden="true"
      />

      {/* Button */}
      <span
        className="
          relative
          flex h-14 w-14
          items-center justify-center
          rounded-full
          bg-[#25D366]
          shadow-[0_8px_24px_-4px_rgba(37,211,102,0.55)]
          transition-transform duration-200
          group-hover:scale-105
          group-active:scale-95
        "
      >
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="h-7 w-7 text-white"
          aria-hidden="true"
        >
          <path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.42.687 4.68 1.878 6.6L3 29l7.09-2.34a12.44 12.44 0 0 0 5.911 1.5h.005c6.905 0 12.5-5.596 12.5-12.5S22.906 3 16.001 3Zm0 22.688h-.004a10.36 10.36 0 0 1-5.283-1.448l-.379-.225-3.938 1.3 1.322-3.836-.247-.393a10.36 10.36 0 0 1-1.583-5.586c0-5.732 4.667-10.4 10.417-10.4 2.78 0 5.393 1.084 7.359 3.052a10.33 10.33 0 0 1 3.045 7.352c0 5.733-4.667 10.184-10.71 10.184Zm5.706-7.79c-.312-.156-1.848-.912-2.134-1.016-.286-.104-.494-.156-.702.156-.208.312-.806 1.016-.988 1.224-.182.208-.364.234-.676.078-.312-.156-1.317-.485-2.508-1.546-.927-.827-1.553-1.849-1.735-2.161-.182-.312-.02-.481.137-.636.14-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.702-1.692-.962-2.317-.253-.608-.51-.526-.702-.536l-.598-.01c-.208 0-.546.078-.832.39-.286.312-1.09 1.066-1.09 2.6 0 1.534 1.116 3.016 1.272 3.224.156.208 2.196 3.353 5.323 4.702.744.321 1.325.513 1.778.657.747.238 1.427.204 1.964.124.599-.09 1.848-.755 2.108-1.484.26-.729.26-1.354.182-1.484-.078-.13-.286-.208-.598-.364Z" />
        </svg>

        {/* Online indicator */}
        <span
          className="
            absolute -right-0.5 -top-0.5
            h-3.5 w-3.5
            rounded-full
            border-2 border-white
            bg-emerald-400
          "
          aria-hidden="true"
        />
      </span>
    </a>
  );
}