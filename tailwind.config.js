/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "caro-1": "url('/src/assets/images/home-carousel-1.svg')",
        "caro-2":
          "url('https://upload.wikimedia.org/wikipedia/commons/6/68/WebRTC_Logo.svg')",
        "caro-3": "url('/src/assets/images/home-carousel-2.svg')",
        home: "url('/src/assets/images/background for spasm.png')",
      },
      fontFamily: {
        adelia: ["ADELIA", "cursive"],
      },
    },
  },
  plugins: [],
};

