import {Link} from 'react-router-dom'
import ConnectLink from '../qubic/connect/ConnectLink'
import logo from '../../assets/logo/HM25.svg'

const Header = () => {
    return (
        <div
            className="fixed h-[78px] flex w-full z-10 top-0 gap-6 justify-center items-center border-b border-solid border-gray-70 bg-gray-90">
            <Link to="/">
                <img src={logo} alt="msvault logo" className="h-14 w-auto"/>
            </Link>
            <ConnectLink/>
        </div>
    )
}

export default Header
