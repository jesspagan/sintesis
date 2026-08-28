export function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='6'
      height='6'
      fill='none'
      role='presentation'
      aria-hidden='true'
      {...props}
    >
      <path
        fill='currentColor'
        d='M6 0v4.4h-.8V1.327L.565 6.001 0 5.431 4.592.8H1.6V0z'
      />
    </svg>
  );
}

export function ExternalLinkMedium(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='10'
      height='10'
      viewBox='0 0 10 10'
      fill='none'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.66671 0H8.66671H10V1.33333L10 7.33333H8.66671V2.21282L0.944152 10L0.00134277 9.0493L7.65328 1.33333H2.66671V0Z'
        fill='currentColor'
      />
    </svg>
  );
}
