import React, { ReactNode } from 'react';
import './Box.css';

type BoxProps = {
    isVerified?: boolean;
    title: string;
    children?: ReactNode;
}

function Box({ isVerified = false, title, children} : BoxProps) {
    return (<div className="box">
                <div className={"box-label " + (isVerified? 'box-verified' : null)}>{title}</div>
                {children}
            </div>);
}

export default Box;