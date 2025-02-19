// import index from '../index.css'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'


function TasksReport(tasks) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs
    console.log(tasks)



    const reportTitle = [{
        text: 'Chamados em aberto',
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45],
        alignment: 'center',
    }]

    const datas = tasks.map((task) => {
        return (
            [
                { text: task.taskId, fontSize: 9 },
                { text: task.client, fontSize: 9 },
                { text: task.subject, fontSize: 9, alignment: 'justify' },
                { text: task.obs[0].obs, fontSize: 9, alignment: 'justify' },
                { text: task.created, fontSize: 9 },
                { text: task.grade, fontSize: 9 },
                { text: task.comment, fontSize: 9 },

            ]
        )

    })

    const reportDatas = [
        {
            table: {
                headerRows: 1,
                widths: [25, 95, 50, 250, 75, 30, 200],
                body: [
                    [
                        { text: 'ID', style: 'tableHeader' },
                        { text: 'Unidade', style: 'tableHeader' },
                        { text: 'Assunto', style: 'tableHeader' },
                        { text: 'Descrição', style: 'tableHeader' },
                        { text: 'Data', style: 'tableHeader' },
                        { text: 'Nota', style: 'tableHeader' },
                        { text: 'Comentário', style: 'tableHeader' }
                    ],
                    ...datas
                    
                    
                ]
                
            },
            layout: 'lightHorizontalLines'
        }
    ]


    function ReportFooter(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                fontSize: 9,
                margin: [0, 10, 20, 0],
                alignment: 'right',
            }
        ]

    }

    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],
        pageOrientation: 'landscape',        

        header: [reportTitle],
        content: [reportDatas],
        footer: ReportFooter
    }

    pdfMake.createPdf(docDefinitions).download()


} export default TasksReport
