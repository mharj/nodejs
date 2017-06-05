const fs = require("fs");
const uuid = require("uuid");
const uuidParse = require('uuid-parse');
const device = '/dev/sda';
const fd = fs.openSync(device, 'rs+');


let GTP = false;

// "OLD" MBR data : http://thestarman.pcministry.com/asm/mbr/PartTables.htm
let mbr = Buffer.allocUnsafe(512);
let readcount = fs.readSync(fd,mbr,0,mbr.length,0);
function readMBR(buf) {
	let out = {};
	out.active = (buf.readUInt8(0)==0x80?true:false);
	out.startCHS = Buffer.from([buf[1],buf[2],buf[3]]);
	out.type = buf.readUInt8(4);
	out.endCHS = Buffer.from([buf[5],buf[6],buf[7]]);
	out.startSector = buf.readUInt16LE(8);
	out.partitionSize = buf.readUInt16LE(12);
	return out;
}
for (var i = 446;i <= 508;i += 16) { // MBR table block
	let partitionTable = mbr.slice(i,i+15);
	let data = readMBR(partitionTable);
	console.log('mbr partition',data);
	if ( data.type == 0xEE ) { // we have GTP type : https://www.win.tue.nl/~aeb/partitions/partition_types-1.html
		GTP = true;
	}
}

// GTP data
if ( GTP ) {
	let header = Buffer.allocUnsafe(512);
	readcount = fs.readSync(fd,header,0,header.length,512);
	const EFI_PART = Buffer.from([0x45,0x46,0x49,0x20,0x50,0x41,0x52,0x54]);
	function readGPT(buf) { // https://en.wikipedia.org/wiki/GUID_Partition_Table
		let out = {};
		if ( buf.indexOf(EFI_PART) != 0 ) {
			throw Error('not GTP entry');
		}
		out.revision = buf[8]+'.'+buf[9]+'.'+buf[10]+'.'+buf[11];
		out.crc32 = header.readUInt16LE(16);
		out.currentLBA = header.readUInt32LE(24);
		out.backupLBA = header.readUInt32LE(32);
		out.uuid = uuidParse.unparse([
			buf[59],buf[58],buf[57],buf[56],
			buf[61],buf[60],buf[63],buf[62],
			buf[64],buf[65],buf[66],buf[67],
			buf[68],buf[69],buf[70],buf[71]
		]);
		out.tableLBA = header.readUInt32LE(72);
		out.partitions = header.readUInt16LE(80);
		out.partitionTableSize = header.readUInt16LE(84);
		out.partitionTableCRC = header.readUInt16LE(88);
		return out;
	}
	let data = readGPT(header);
	console.log('GTP header',data);
}
