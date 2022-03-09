var express = require("express")
var app = express()

var md5 = require("md5")
//var xmlBuilder = require("xmlBuilder")
var path = require('path');

const fs = require('fs');

let rawdata = fs.readFileSync('cadastro.json');
let cadastro = JSON.parse(rawdata);

var zip = require("zip-a-folder")


var HTTP_PORT = process.env.PORT || 8080

//  var bodyParser = require("body-parser");
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/", (req, res, next) => {
    Object.entries(cadastro).forEach(([key, value]) => {
        value.forEach( ( value2) => {
            createXML(key, value2)
        });
        ZipClass.zipXML();
    });
    res.header("Content-Type", "application/xml");
    res.status(200).send(`<Access>Download Liberado, acesse: /download</Access>`);
});

app.get("/download", (req, res, next) => {
    res.setHeader('Content-type','application/zip');
    res.sendFile(__dirname + '/xml.zip');
  
});
  
function createXML(key, value2) {

    var label = '';
    var Abbreviation__c = '';
    var Active__c = '';
    var SourceSystem__c = '';
    var SourceValue__c = '';
    var TargetSystem__c = '';
    var TargetValue__c = '';
    var Nationality__c = '';
    var Classification__c = '';

    if(key == 'TIPODOCUMENTO') {
        Active__c = value2.INVISUALIZA != null ? true : false;
        if(!Active__c) return;
        label = key+'_'+value2.IDTIPODOCUMENTO;
        Abbreviation__c = value2.SGTIPODOCUMENTO;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDTIPODOCUMENTO;
        TargetSystem__c = 'SALESFORCE';
        TargetValue__c = value2.DSTIPODOCUMENTO;
    } else if(key == 'ESTADO CIVIL') {
        label = key+'_'+value2.IDESTADOCIVIL;
        Active__c = true;
        Abbreviation__c = value2.SGESTADOCIVIL;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDESTADOCIVIL;
        TargetSystem__c = 'SALESFORCE';
        TargetValue__c = value2.DSESTADOCIVIL;
    } else if(key == 'SEXO') {
        label = key+'_'+value2.IDSEXO;
        Active__c = true;
        Abbreviation__c = value2.SGSEXO;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDSEXO;
        TargetSystem__c = 'SALESFORCE';
        TargetValue__c = value2.DSSEXO;
    } else if(key == 'PROFISSAO') {
        label = key+'_'+value2.IDPROFISSAO;
        Active__c = true;
        Abbreviation__c = '';
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDPROFISSAO;
        TargetSystem__c = 'SALESFORCE';
        TargetValue__c = value2.DSPROFISSAO;
    } else if(key == 'GRAU INSTRUCAO') {
        label = key+'_'+value2.IDESCOLARIDADE;
        Active__c = true;
        Abbreviation__c = '';
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDESCOLARIDADE;
        TargetSystem__c = 'SALESFORCE';
        TargetValue__c = value2.DSESCOLARIDADE;
    } else if(key == 'PAIS') {
        if(value2.INPREENCHELISTA == 0) return;
        Active__c = true;
        label = key+'_'+value2.IDPAIS;
        Abbreviation__c = value2.SGPAIS;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDPAIS;
        TargetSystem__c = 'SALESFORCE';
        TargetValue__c = value2.NMPAIS;
        Nationality__c = value2.DSNACIONALIDADE;
    } else if(key == 'TIPO CONTATO') {
        Active__c = true;
        label = key+'_'+value2.IDTIPOCOMUNICACAO;
        Abbreviation__c = value2.SGTIPOCOMUNICACAO;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDTIPOCOMUNICACAO;
        TargetSystem__c = 'SALESFORCE'; 
        TargetValue__c = value2.DSTIPOCOMUNICACAO;
        Classification__c = value2.SGCLASSIFICACAO;
    } else if(key == 'TIPO COMPLEMENTO') {
        Active__c = true;
        label = key+'_'+value2.COD_TIPO_COMPLEMENTO;
        Abbreviation__c = value2.DSC_ABREV_TIPO_COMPLEMENTO;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.COD_TIPO_COMPLEMENTO;
        TargetSystem__c = 'SALESFORCE'; 
        TargetValue__c = value2.DSC_TIPO_COMPLEMENTO;
    } else if(key == 'UF') {
        if(value2.INPREENCHELISTA == 0) return;
        Active__c = true;
        label = key+'_'+value2.IDUF;
        Abbreviation__c = value2.SGUF;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDUF;
        TargetSystem__c = 'SALESFORCE'; 
        TargetValue__c = value2.NMUF;
    } else if(key == 'TIPO PESSOA') {
        Active__c = true;
        label = key+'_'+value2.IDTIPOPESSOA;
        Abbreviation__c = value2.SGTIPOPESSOA;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDTIPOPESSOA;
        TargetSystem__c = 'SALESFORCE'; 
        TargetValue__c = value2.DSTIPOPESSOA;
    } else if(key == 'TIPO CARTEIRA') {
        Active__c = true;
        label = key+'_'+value2.IDTIPOCARTEIRA;
        Abbreviation__c = value2.SGTIPOCARTEIRA;
        SourceSystem__c = 'VIVONET';
        SourceValue__c = value2.IDTIPOCARTEIRA;
        TargetSystem__c = 'SALESFORCE'; 
        TargetValue__c = value2.DSTIPOCARTEIRA;
        Classification__c = value2.IDCLASSIFICACAOCARTEIRA;
    }

    let data = `<?xml version="1.0" encoding="UTF-8"?>`;
    data += `<CustomMetadata xmlns="http://soap.sforce.com/2006/04/metadata" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">`;
    data += `<label>${label}</label>`;
    data += `<protected>false</protected>`;

    data += `<values> 
        <field>Abbreviation__c</field>
        <value xsi:type="xsd:string">${Abbreviation__c}</value>
    </values>`;
    data += `<values> 
        <field>Active__c</field>
        <value xsi:type="xsd:boolean">${Active__c}</value>
    </values>`;
    data += `<values> 
        <field>DataType__c</field>
        <value xsi:type="xsd:string">${key}</value>
    </values>`;
    data += `<values> 
        <field>SourceSystem__c</field>
        <value xsi:type="xsd:string">${SourceSystem__c}</value>
    </values>`;
    data += `<values> 
        <field>SourceValue__c</field>
        <value xsi:type="xsd:string">${SourceValue__c}</value>
    </values>`;
    data += `<values> 
        <field>TargetSystem__c</field>
        <value xsi:type="xsd:string">${TargetSystem__c}</value>
    </values>`;
    data += `<values> 
        <field>TargetValue__c</field>
        <value xsi:type="xsd:string">${TargetValue__c}</value>
    </values>`;
    data += `<values> 
        <field>Nationality__c</field>
        <value xsi:type="xsd:string">${Nationality__c}</value>
    </values>`;
    data += `<values> 
        <field>Classification__c</field>
        <value xsi:type="xsd:string">${Classification__c}</value>
    </values>`;
    data += `</CustomMetadata>`;

    fs.writeFile("C:\\Users\\fesilveira\\Documents\\node-express-rest-api-example-master\\node-express-rest-api-example-master\\xml\\DomainInputOutput."+label.replace(/\s/g, '')+".md-meta.xml", data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

class ZipClass {
    static async zipXML() {
        var uri_in = "C:\\Users\\fesilveira\\Documents\\node-express-rest-api-example-master\\node-express-rest-api-example-master\\xml";
        var uri_out = "C:\\Users\\fesilveira\\Documents\\node-express-rest-api-example-master\\node-express-rest-api-example-master\\xml.zip";
        await zip.zip(uri_in, uri_out);
    }
}
