import React from 'react';
import { render } from 'react-dom';
import './Box.css';

function Box(props) {
    const isVerified = props.isVerified;
    const title = props.title;
    return (<div class="box">
                <div className={"box-label " + (isVerified? 'box-verified' : null)}>{title}</div>
                {props.children}
            </div>);
}

export default Box;