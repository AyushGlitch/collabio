import Image from 'next/image'
import * as motion from 'framer-motion/client'

const logos = [
    { src: '/nextjs.svg', alt: 'Next.js' },
    { src: '/render.svg', alt: 'Render' },
    { src: '/auth0.svg', alt: 'Auth0' },
    { src: '/express.svg', alt: 'Express' },
    { src: '/framer.svg', alt: 'Framer' },
    { src: '/prisma.svg', alt: 'Prisma' },
    { src: '/postgresql.svg', alt: 'PostgreSQL' },
    { src: '/recoil.svg', alt: 'Recoil' },
    { src: '/shadcnui.svg', alt: 'shadcn/ui' },
    { src: '/socketio.svg', alt: 'Socket.IO' },
    { src: '/tailwindcss.svg', alt: 'Tailwind CSS' },
    { src: '/typescript.svg', alt: 'TypeScript' },
    { src: '/neon.svg', alt: 'Neon' },
];


export default async function LogoTicker() {
    return (
        <section className='my-10 [mask-image:linear-gradient(to_top,transparent,black_20%,black_80%,transparent)]'>
            <div className="container">
                <div className='flex items-center gap-16'>
                    <div className='flex-none'>
                        <h2 className='font-semibold text-3xl'>
                            Tech Stack
                        </h2>
                    </div>
                    <div className='flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]'>
                        <motion.div 
                            initial={{ translateX: '0%' }}
                            animate={{ translateX: '-50%' }}
                            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                            className='flex flex-none gap-14 py-6 pr-14'
                        >
                            {[...logos, ...logos].map((logo, i) => (
                                <Image src={logo.src} alt={logo.alt} key={logo.alt+i} width={50} height={50} className='invert' />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}