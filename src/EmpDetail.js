import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const EmpDetial = () =>
{
    const { empId } = useParams();
    const [ empData, empDataChange ] = useState( null );

    useEffect( () =>
    {
        fetch( `${ process.env.REACT_APP_SERVER }/employee/${ empId }` ).then( ( res ) =>
        {
            return res.json();
        } ).then( ( resp ) =>
        {
            empDataChange( resp );
        } ).catch( ( err ) =>
        {
            console.log( err.message );
        } )
    } )

    return (
        <div className="container" style={ { "textAlign": "left" } }>
            <div className="card">
                <div className="card-title empForm">
                    <h2>Employee Detail</h2>
                </div>
                <div className="card-body">

                    { empData &&
                        <div>
                            <h2>The Employee name is: { empData.name } ({ empData.id })</h2>
                            <h3>Contact Details</h3>
                            <h5>Email is : { empData.email }</h5>
                            <h5>Phone is : { empData.phone }</h5>
                            <Link to="/" className="btn btn-danger">Back to Listing</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default EmpDetial
