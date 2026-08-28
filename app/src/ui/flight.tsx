export function Flight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      fill='none'
      role='presentation'
      aria-hidden='true'
      {...props}
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17.48 9.062h-5.858L8.186 2.5H6.574l1.79 6.562H2.917l-.934-2.017H1.25l.476 3.232-.476 3.233h.732l.934-2.016h5.447l-1.79 6.562h1.611l3.437-6.562h5.858c.7 0 1.271-.545 1.271-1.216s-.567-1.216-1.27-1.216'
      />
    </svg>
  );
}
