import logo from '../assets/DarkLogo.svg';

import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src={logo} alt="App Logo" {...props} />
    );
}
