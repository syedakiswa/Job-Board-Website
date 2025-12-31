
import dynamic from 'next/dynamic'


const ApplyClient = dynamic(() => import('./ApplyClient'), { ssr: false })

export default function Page() {
  return <ApplyClient />
}
