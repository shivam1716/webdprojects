import React, { forwardRef } from 'react'

const Cell = forwardRef((props, ref) => {
  const {row, col, value, className, onClick} = props;

  return (
    <span key={row+''+col} className={className} ref={ref} onClick={onClick} >{value?value:null}</span>
  )
})

export default Cell