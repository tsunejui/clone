import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        linkedin: '#0A66C2',
      },
    },
  },
  plugins: [],
}

export default config
