import plugLight from "./assets/plugLight.svg"
import React, { useEffect } from "react"
import "./connect2ic.css"

const buttonStyles = {
  color: "white",
  width: "100%",
  padding: "15px 25px",
  border: "none",
  borderRadius: "10px",
  fontSize: "20px",
  fontWeight: 600,
  background: "transparent",
  outline: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}

const imgStyles = {
  height: "40px",
  marginLeft: "-1em",
  marginRight: "0.7em",
}

// import plugDark from './assets/plugDark.svg';

// const Button = styled('button', {
//   border: 'none',
//   background: 'linear-gradient(93.07deg, #FFD719 0.61%, #F754D4 33.98%, #1FD1EC 65.84%, #48FA6B 97.7%)',
//   padding: '2px',
//   borderRadius: '10px',
//   cursor: 'pointer',
//   transition: 'transform 0.3s',
//
//   '&:hover': {
//     transform: 'scale(1.03)',
//   },
//
//   '& > div': {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     background: 'white',
//     padding: '5px 12px',
//     borderRadius: '10px',
//     fontSize: '16px',
//     fontWeight: 600,
//   },
//
//   '& .dark': {
//     background: '#111827',
//     color: 'white',
//   },
//
//   '& img': {
//     marginRight: '9px',
//   },
//
//   variants: {
//     dark: {
//       true: {
//         '& > div': {
//           background: '#111827',
//           color: 'white',
//         },
//       }
//     },
//   },
// });


const PlugConnect = ({ onClick }) => {
  return (
    <button className={"button-styles plug-styles"} onClick={onClick}>
      <img
        className={"img-styles"}
        src={plugLight}
        alt="Plug logo"
      />
      Plug
    </button>
  )
}

const usePlug = ({ onConnect, whitelist, host }) => {
  const connect = async () => {
    if (!(window as any).ic?.plug) {
      window.open("https://plugwallet.ooo/", "_blank")
      return
    }

    // @ts-ignore
    const connected = await (window as any)?.ic?.plug?.requestConnect({
      whitelist,
      host,
    })

    if (!connected) return

    console.log(connected)
    onConnect({ type: "plug" })
  }

  const disconnect = () => {

  }

  const init = async () => {
    // if (!(window as any).ic?.plug) {
    //   window.open("https://plugwallet.ooo/", "_blank")
    //   return
    // }
    //
    // // @ts-ignore
    // const connected = await (window as any)?.ic?.plug?.requestConnect({
    //   whitelist,
    //   host,
    // })
    //
    // if (!connected) return
    //
    // console.log(connected)
    // onConnect({ type: "plug" })
  }

  useEffect(() => {
    init()
  }, [])

  return { connect, disconnect }
}

export { usePlug, PlugConnect }