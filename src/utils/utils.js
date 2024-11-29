import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { errorIconColor, successIconColor } from "../components/layout/ui/Theme";
import { Cancel as CancelIcon } from "@mui/icons-material";
import React from "react";
import {Chip} from "@mui/material";

const addEvent = (elem, type, eventHandle) => {
    if (elem == null || typeof elem === 'undefined') {
        return;
    }

    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = eventHandle;
    }
};

const removeEvent = (elem, type, eventHandle) => {
    if (elem == null || typeof elem === 'undefined') {
        return;
    }

    if (elem.removeEventListener) {
        elem.removeEventListener(type, eventHandle, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, eventHandle);
    } else {
        elem['on' + type] = null;
    }
};

const triggerCustomEventOnElement = (element, eventName, eventDetail) => {
    let event = new CustomEvent(eventName, {
        detail: eventDetail
    });
    element.dispatchEvent(event);
};

const triggerCustomEvent = (eventName, eventDetail = {}) => {
    triggerCustomEventOnElement(window, eventName, eventDetail);
};

// eslint-disable-next-line no-extend-native
String.prototype.equalsIgnoreCase = function (str) {
    return str !== null && typeof str === 'string' && this.toUpperCase() === str.toUpperCase()
}

// eslint-disable-next-line no-extend-native
String.prototype.removeWhiteSpaces = function (replaceBy) {
    return this && this.replace(/\s/g, replaceBy || '')
}
// eslint-disable-next-line no-extend-native
Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1)
    },
    enumerable: false
})

function parseToken(token = '') {
    if(token && String(token) !== 'undefined'){
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload) || {};
    } else {
        return {}
    }
}

const getUserDetail = () => {
    return { ...parseToken(localStorage.getItem('token')) }
}

const checkObjProperties = (obj) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== "")
            return true;
    }
    return false;
}

const isEmailValid = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isPhoneValid = (num) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return re.test(String(num).toLowerCase());
}

export const getCheckStatusIcon = (comparator = false) => {
    let success
    if (typeof comparator === 'function') {
        success = comparator();
    } else {
        success = comparator
    }
    return success ? (
        <CheckCircleIcon style={{ color: successIconColor }} />
    ) : (
        <CancelIcon style={{ color: errorIconColor }} />
    )
}

export const getActiveInactiveStatus = (comparator = false) => {
    let success
    if (typeof comparator === 'function') {
        success = comparator();
    } else {
        success = comparator
    }
    return success ? (
        <Chip label="Active" color="success" />
    ) : (
        <Chip label='Inactive' color='error' />
    )
}

export const textFormatter = (str) => {
    return str || '--'
}

export const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
}

export const getRoutesByPermission = (routes) => {
    const {user: {role = ''} = {}} = getUserDetail();
    const arr = [];
    routes.forEach(route => {
        const {permissions = []} = route;
        if(permissions.indexOf(role) > -1){
            arr.push(route)
        }
    })
    return arr;
}

export const serialize = (obj = {}) => {
    const str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            const q = encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])
            str.push(q.replaceAll('%20', '+'));
        }
    return str.join("&");
}

export const getDiff = (local, actual) => {
    const diffWithVal = {};
    const localKeys = Object.keys(local);
    for (let key of localKeys) {
        if (key !== "password" && actual[key] !== local[key])
            diffWithVal[key] = local[key];
        if (key === "password" && local[key]) diffWithVal[key] = local[key];
    }
    return diffWithVal;
};

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
export const getDollarPrefixedPrice = (price) => {
    return USDollar.format(price)
}

// Just for reference
/*
* const createPdf = () => {
        const doc = new jsPDF({
            orientation: 'p'
        }),
            xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth('freightdok') * doc.internal.getFontSize() / 3);
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(PRIMARY_BLUE);
        doc.text('freightdok', xOffset, 20);

        let left = 10
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('Sunny Freight', left, 30)

        doc.setFontSize(15);
        doc.setTextColor('rgb(0,0,0)')
        doc.text('Bill to: '+brokerage, left, 40)

        doc.setFontSize(15);
        doc.setTextColor('rgb(0,0,0)')
        doc.text('Load Number: '+ loadNumber, left, 50)

        doc.setFontSize(16)
        doc.setFont("helvetica", "bold");
        doc.text('Total: ' + getTotal(), left, 60)

        doc.setFontSize(16)
        doc.setFont("helvetica", "normal");
        doc.text('Notes: ' + (notes || 'N.A'), left, 70)

        doc.text(`Rate of confirmation: ${rateConfirmation.length ? 'Available' : 'N.A'}`, left, 80);
        doc.text(`Proof of Delivery: ${proofDelivery.length ? 'Available' : 'N.A'}`, left, 90);
        doc.text(`Accessorials: ${accessorials.length ? 'Available' : 'N.A'}`, left, 100);

        const headerStyles = {
            fillColor: [240, 240, 240],
            textColor: [0],
            fontFamily: 'helvetica',
            fontStyle: 'bold',
        };

        // doc.table(left, 80, services, headers, { autoSize: true });
        // autoTable(doc, { html: '#my-table' })
        const rows = services?.map((item, index) => [
            (index + 1).toString(),
            item.serviceName.toString(),
            item.description?.toString(),
            item.quantity?.toString(),
            getTotal(item.price?.toString()),
        ]);

        doc.autoTable({
            head: [['S.No.', 'Services', 'Description', 'Quantity', 'Price']],
            startY: 110,
            headStyles: {
                fillColor: headerStyles.fillColor,
                textColor: headerStyles.textColor,
                fontStyle: headerStyles.fontStyle,
                fontSize: 14, // Adjust the font size as needed
                font: 'Newsreader', // Set the font family
                halign: 'left',
                cellPadding: { top: 2, right: 5, bottom: 2, left: 2 }
            },
            body: rows,
            bodyStyles: {
                fontSize: 14, // Adjust the font size for the body
                font: 'helvetica', // Set the font family for the body
                cellPadding: { top: 2, right: 5, bottom: 2, left: 2 }, // Adjust cell padding
                textColor: [0, 0, 0], // Set text color for the body
                rowPageBreak: 'avoid', // Avoid row page breaks
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 50 },
                2: { cellWidth: 60 },
                3: { cellWidth: 30 },
                4: { cellWidth: 30 },
            }
        });

        doc.addPage('a4')

        const src = 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?cs=srgb&dl=pexels-luisdalvan-1770809.jpg&fm=jpg'

        // const image = await getDataUri('https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?cs=srgb&dl=pexels-luisdalvan-1770809.jpg&fm=jpg')
        getDataUri(src, (img) => {
            doc.addImage(img, 'jpg', 10, 10, 12, 15)
        })

        const string = doc.output('datauristring');
        const iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
        const x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
    }


* */

export {
    addEvent,
    removeEvent,
    isPhoneValid,
    getUserDetail,
    isEmailValid,
    checkObjProperties,
    triggerCustomEvent
}