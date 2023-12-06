import React from 'react';
import styles from '@/styles/footer.module.css';

const Footer = () => {
    return (
        <div className={`${styles.footer_bottom} clearfix`}>
            <div className="container d-md-row py-2">
                <div className={styles.copyright}>
                    &copy; Copyright <strong><span>MA ZAHA 1</span></strong>. All Rights Reserved
                </div>
                <div className={styles.credits}>
                    Developed by TIM IT MA Zainul Hasan 1 Genggong
                </div>
            </div>
        </div>
    );
};

export default Footer;