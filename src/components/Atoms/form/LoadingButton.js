import { Button, CircularProgress } from '@mui/material'
import React from 'react'
import PropTypes from "prop-types";

const LoadingButton = ({ children, variant = 'contained', isLoading = false, loadingText, ...rest }) => {
    const text = isLoading ? !!loadingText ? loadingText: children : children
    return (
        <Button
            disabled={isLoading}
            variant={variant}
            {...rest}
            startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : undefined}
        >
            {text}
        </Button>
    )
}

LoadingButton.propTypes = {
    children: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
    loadingText: PropTypes.string
}

export default LoadingButton