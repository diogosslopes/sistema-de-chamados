// import index from '../index.css'
import pdfMake from 'pdfmake/build/pdfmake' 
import pdfFonts from 'pdfmake/build/vfs_fonts' 


export default function TasksReport(tasks) {

    pdfMake.vfs = pdfFonts.pdfMake.vfs

    console.log(tasks)

    const reportTitle =[{
        text: 'Chamados em aberto',
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45]
    }]

    const reportDatas = []

    const reportFooter = []

    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        reader: [reportTitle],
        content: [reportDatas],
        footer: [reportFooter]
    }

    pdfMake.createPdf(docDefinitions).download()


}