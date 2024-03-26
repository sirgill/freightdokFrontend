import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';

const fileUrl = 'https://images.pexels.com/photos/3876332/pexels-photo-3876332.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
const type = 'png'

export default class DocViewer extends Component {

    render() {
        console.log("---fileurl", this.props.fileUrl)
        return (
            <FileViewer
                fileType={'jpeg'}
                filePath={this.props.fileUrl}
            // errorComponent={CustomErrorComponent}
            // onError={this.onError}
            />
        );
    }

    onError(e) {
        console.log(e, 'error in Doc-viewer');
    }
}