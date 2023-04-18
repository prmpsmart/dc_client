/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";



const EmpListing = () =>
{
    const [ empdata, empDataChange ] = useState( null );
    const navigate = useNavigate();

    const editItem = ( id ) =>
    {
        navigate( `/employee/edit/${ id }` );
    }

    const removeItem = ( id ) =>
    {
        if ( window.confirm( `Do you want to remove?` ) )
        {
            fetch( `${ process.env.REACT_APP_SERVER }/employee/${ id }`, {
                method: "DELETE",
                headers: { "content-type": "application/json" },
            } ).then( ( res ) =>
            {
                alert( "Removed Successfully." );
                // window.location.reload();
            } ).catch( ( e ) =>
            {
                console.log( e.message );
            } );
        }
    }

    const loadDetail = ( id ) =>
    {
        navigate( `/employee/detail/${ id }` );
    }

    useEffect( () =>
    {
        fetch( `${ process.env.REACT_APP_SERVER }/employee` ).then( ( res ) =>
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
        <div className="container">
            <div className="card">
                <div className="card-title">
                    <h2>Employee Listing</h2>
                </div>
                <div className="card-body">
                    <div className="divbtn">
                        <Link to="employee/create" className="btn btn-success">Add New (*)</Link>
                    </div>
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>Phone</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            { empdata &&
                                empdata.map( item => (
                                    <tr key={ item.id }>
                                        <td>{ item.id }</td>
                                        <td>{ item.name }</td>
                                        <td>{ item.email }</td>
                                        <td>{ item.phone }</td>
                                        <td>
                                            <a onClick={ () => { editItem( item.id ) } } className="btn btn-success">Edit</a>
                                            <a onClick={ () => { removeItem( item.id ) } } className="btn btn-danger">Remove</a>
                                            <a onClick={ () => { loadDetail( item.id ) } } className="btn btn-primary">Details</a>
                                        </td>
                                    </tr>
                                ) )
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
}

export default EmpListing;
