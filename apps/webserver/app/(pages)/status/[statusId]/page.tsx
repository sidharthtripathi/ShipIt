export default function StatusPage({params : {statusId}} : {params : {statusId : string}}){
    return (
        <div>
            status of given deployment
            {statusId}
        </div>
    )
}