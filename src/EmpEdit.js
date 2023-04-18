import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";


const EmpEdit = () =>
{
    const { empId } = useParams();
    const url = `${ process.env.REACT_APP_SERVER }/employee/${ empId }`;

    useEffect( () =>
    {
        fetch( url ).then( ( res ) =>
        {
            return res.json();
        } ).then( ( resp ) =>
        {
            idChange( resp.id );
            nameChange( resp.name );
            emailChange( resp.email );
            phoneChange( resp.phone );
            activeChange( resp.active );
        } ).catch( ( err ) =>
        {
            console.log( err.message );
        } )
    } )

    const [ id, idChange ] = useState( 0 );
    const [ name, nameChange ] = useState( "" );
    const [ email, emailChange ] = useState( "" );
    const [ phone, phoneChange ] = useState( "" );
    const [ active, activeChange ] = useState( true );
    const [ validation, validationChange ] = useState( false );
    const navigate = useNavigate();

    const handleSubmit = ( e ) =>
    {
        const empData = { name, email, phone, active };
        e.preventDefault();
        fetch( url, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify( empData )
        } ).then( ( res ) =>
        {
            alert( "Saved Successfuly." );
            navigate( '/' );
        } ).catch( ( err ) =>
        {
            console.log( err.message );
        } )
    }

    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6">
                <form className="container" onSubmit={ handleSubmit }>
                    <div className="card" style={ { "textAlign": "left" } }>
                        <div className="card-title empForm">
                            <h2>Employee Edit</h2>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>ID</label>
                                        <input disabled className="form-control" value={ id }></input>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input required value={ name } onMouseDown={ e => validationChange( true ) } onChange={ e => nameChange( e.target.value ) } className="form-control"></input>
                                        { name.length === 0 && validation && <span className="text-danger"> Enter the name</span> }
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input required type="email" value={ email } onChange={ e => emailChange( e.target.value ) } className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input required value={ phone } onChange={ e => phoneChange( e.target.value ) } className="form-control"></input>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-check">
                                        <input value={ active } onChange={ e => activeChange( e.target.checked ) } type="checkbox" className="form-check-input"></input>
                                        <label className="form-check-label">Is Active</label>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-success">Save</button>
                                        <Link to="/" className="btn btn-danger">Back</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmpEdit
