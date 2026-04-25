import styles from './style.module.scss';
import { translate } from '../../anim';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { config } from '@/data/config';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>Developer:</span>{' '}
          <span className="text-brand">{config.author}</span>
        </motion.li>
      </ul>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>Typography:</span> Inter & Archivo
        </motion.li>
      </ul>
      <ul>
        <motion.li
          custom={[0.3, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <span>Graphics:</span> Spline & Three.js
        </motion.li>
      </ul>
    </div>
  );
}