// import index from '../index.css'


export default function Title({ children, name }) {

    return (
        <div>
            {children}
            <h1> {name} </h1>
        </div>
    )
}