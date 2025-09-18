import type { SVGProps } from "react"

const IconLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
    {...props}
  >
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 6a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V6zm4 0" />
  </svg>
)
export default IconLogo