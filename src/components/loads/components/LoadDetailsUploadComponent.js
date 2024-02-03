import {Button, Grid, Paper, Stack, Typography} from "@mui/material";
import React, {Fragment, useState} from "react";
import {getCheckStatusIcon} from "../../../utils/utils";
import Modal from "../../Atoms/Modal";
import {styled} from "@mui/material/styles";
import {PRIMARY_BLUE} from "../../layout/ui/Theme";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DescriptionIcon from '@mui/icons-material/Description';
import {Alert} from "../../Atoms";

const FileContainer = styled(Paper)(({}) => ({
    width: 100,
    height: 100,
    borderRadius: 5,
    overflow: 'hidden',
    padding: 8,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
}))

const FileViewer = ({files = [], onClose, onRemoveAll}) => {
    // console.log(files)
    const config={
        title: 'Edit File'
    }
    const Files = (files || []).map(file => {
        return <FileContainer elevation={3}>
            <DescriptionIcon sx={{color: PRIMARY_BLUE}} />
            <Typography variant='subtitle2' align='center' sx={{width: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis'}}>{file.name}</Typography>
        </FileContainer>
    })

    return <Modal config={config} closeCallback={onClose}>
        <Grid container spacing={2} sx={{display: 'grid'}}>
            <Grid item>
                <Alert config={{open: true, message: 'Previous files, if exist will be overwritten with new files.', severity: 'info'}} />
            </Grid>
            {files && <Grid item>
                <Button variant='outlined' sx={{float: 'right'}} onClick={onRemoveAll} color='error'>Remove All</Button>
            </Grid>}
            <Grid item>
                <Grid container gap={2} sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                    {Files}
                </Grid>
            </Grid>
        </Grid>
    </Modal>
}

const LoadDetailsUploadComponent = (props) => {
    const [fileViewConfig, setFileViewConfig] = useState({open: false, config: {}})
    const {
        edit, rateConfirmation = [], proofDelivery = [], accessorialsFiles = [], handleFileChange, rateConfirmationRef,
        proofDeliveryRef, accessorialsRef, state, rateConFile, podFile, formAccessorialsFiles
    } = props;
    // console.log(rateConFile)
    // console.log(accessorialsFiles)

    function viewClickHandler(file, name, e) {
        e.stopPropagation()
        setFileViewConfig({open: true, config: [...file], name})
    }

    function onFileViewClose() {
        setFileViewConfig({open: false, config: null});
    }

    function onRemoveAll() {
        handleFileChange({target: { name: fileViewConfig.name, files: null }})
        onFileViewClose();
    }

    return (<Stack sx={{alignItems: 'end'}}>
        {fileViewConfig.open && <FileViewer files={fileViewConfig.config} onClose={onFileViewClose} onRemoveAll={onRemoveAll} />}
        <Stack direction={'row'} spacing={2} sx={{mb: 1}}>
            {rateConfirmation.length ? (rateConfirmation.map((roc, idx) => {
                return (<><span style={{margin: 0, padding: 0, marginLeft: '2px'}}>
                          <a href={roc} target="_blank">
                            Rate Con-{idx + 1}
                          </a>
                        </span></>)
            })) : (<span>Rate Con</span>)}
            <span>
                      {edit ? <Fragment>
                              {rateConFile
                                  ? <Button variant="outlined" component="span" size='small' onClick={viewClickHandler.bind(this, rateConFile, 'rateConfirmation')} startIcon={<OpenInNewIcon />}>
                                        View
                                    </Button>
                                  : <label htmlFor="contained-button-file1">
                                  <input
                                      style={{display: 'none'}}
                                      type="file"
                                      multiple
                                      name="rateConfirmation"
                                      disabled={!edit || state.auth.user.role === "driver"}
                                      onChange={handleFileChange}
                                      ref={rateConfirmationRef}
                                      id="contained-button-file1"
                                  />
                                  <Button variant="outlined" component="span" size='small'>
                                      {'Attach'}
                                  </Button>
                              </label>}
                      </Fragment>
                          : getCheckStatusIcon(!!rateConfirmation.length)}
                    </span>
        </Stack>
        <Stack direction={'row'} spacing={2} sx={{mb: 1}}>
            {proofDelivery.length ? (proofDelivery.map((pod, idx) => {
                return (<>
                          <span style={{margin: 0, padding: 0, marginLeft: '2px'}}>
                            <a href={pod} target="_blank">
                              POD-{idx + 1}
                            </a>
                          </span>
                </>)
            })) : (<span>POD</span>)}
            <span>
                      {edit ? podFile ? <Button variant="outlined" component="span" size='small' onClick={viewClickHandler.bind(this, podFile, 'proofDelivery')} startIcon={<OpenInNewIcon />}>
                                  View
                              </Button>
                              : <label htmlFor="contained-button-file2">
                                  <input
                                      style={{display: 'none'}}
                                      type="file"
                                      multiple
                                      name="proofDelivery"
                                      disabled={!edit}
                                      onChange={handleFileChange}
                                      ref={proofDeliveryRef}
                                      id="contained-button-file2"
                                  />
                                  <Button variant="outlined" component="span" size='small'>
                                      Attach
                                  </Button>
                              </label>
                          : getCheckStatusIcon(!!proofDelivery.length)}
                    </span>
        </Stack>
        <Stack direction={'row'} spacing={2}>
            {accessorialsFiles.length ? (accessorialsFiles.map((acc, idx) => {
                return (<>
                          <span style={{margin: 0, padding: 0, marginLeft: '2px'}}>
                            <a href={acc} target="_blank">
                              Accessorials-{idx + 1}
                            </a>
                          </span></>)
            })) : (<span>Accessorials</span>)}
            <span>
                      {edit ? formAccessorialsFiles
                          ? <Button variant="outlined" component="span" size='small' onClick={viewClickHandler.bind(this, formAccessorialsFiles, 'accessorialsFiles')} startIcon={<OpenInNewIcon />}>
                              View
                          </Button>
                          : <Fragment>
                          <label htmlFor="contained-button-file3">
                              <input
                                  style={{display: 'none'}}
                                  type="file"
                                  multiple
                                  name="accessorialsFiles"
                                  disabled={!edit || state.auth.user.role === "driver"}
                                  onChange={handleFileChange}
                                  ref={accessorialsRef}
                                  id="contained-button-file3"
                              />
                              <Button variant="outlined" component="span" size='small'>
                                  Attach
                              </Button>
                          </label>
                      </Fragment> : getCheckStatusIcon(!!accessorialsFiles?.length)}
                    </span>
        </Stack>
    </Stack>)
}

export default LoadDetailsUploadComponent;