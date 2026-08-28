export function Caret(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='12'
      height='12'
      fill='none'
      role='presentation'
      aria-hidden='true'
      {...props}
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M6 9 .75 3h10.5z'
        clipRule='evenodd'
      />
    </svg>
  );
}
