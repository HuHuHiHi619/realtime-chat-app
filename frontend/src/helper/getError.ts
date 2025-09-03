
import type { ApiError } from "../types/errorTypes";


export const getErrorMessage = (error :unknown) : string => {
    if(error instanceof Error) return error.message
    if(typeof error === 'string') return error
    return 'Something went wrong'
}

export const handleApiError = (error : any , context? :{
  formName : string,
  pageName : string,
  setError: Function,
  setFormErrors: Function,
  setPageErrors: Function,
  showGlobalError?: boolean,
}) => {

  console.log('handleApiError: full error:', error);
  console.log('handleApiError: error.data:', error.data);
 
  if(error?.data){
    const apiError : ApiError = error.data

    if(context?.showGlobalError !== false){
      context?.setError(apiError)
    }

    if(apiError.type === 'validation' && apiError.errors && context?.formName){
      context.setFormErrors(context.formName , apiError.errors)
    }

    if(context?.pageName){
      context.setPageErrors(context.pageName , apiError.errors)
    }
    
  } else {
    const unknownError : ApiError = {
      type : 'unknown',
      message : getErrorMessage(error),
      errors : {}
    }

    if(context?.showGlobalError !== false) {
      context?.setError(unknownError)
    }
    if(context?.pageName){
      context.setPageErrors(context.pageName , unknownError.message)
    }
  }
}