
class GenerateError(Exception):
    """Custom exception for errors in the `generate` function."""
    def __init__(self, message):
        super().__init__(message)


class BadRequestError(Exception):
    """Custom exception for bad requests."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message
        

class PDFDecodingError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message


class PDFProcessingError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message
