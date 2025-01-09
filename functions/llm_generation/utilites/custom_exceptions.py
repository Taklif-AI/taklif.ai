class GenerationError(Exception):
    """Custom exception for errors in the `llm generation` functions."""
    def __init__(self, message):
        super().__init__(message)


class BadRequestError(Exception):
    """Custom exception for bad requests."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message


class PDFDecodingError(Exception):
    """Custom exception for pdf decoding errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message


class PDFProcessingError(Exception):
    """Custom exception for pdf processing errors."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message
