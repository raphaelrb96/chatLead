
//rascunho
function chatObject(obj) {


    const mContato = obj.contact
    const mName = mContato.pushname;
    const mIsMyContact = mContato.isMyContact;
    const mArchive = obj.archive;
    const mIsOnline = mContato.isOnline;

    //console.log(JSON.stringify(mContato))
    
    console.log(`${mName} - ${mIsMyContact ? 'Contato Salvo' : 'Não Salvo'} - ${mArchive ? 'Chat Arquivado' : 'Chat Aberto'} - ${mIsOnline ? 'On' : 'Off'} \n\n\n`);

    return;

    const {id, labels, lastReceivedKey, t, unreadCount, archive, isReadOnly, 
        hasChatBeenOpened, tcTokenSenderTimestamp, endOfHistoryTransferType, 
        isGroup, contact, isOnline, lastSeen} = obj;

    const {server, user, _serialized} = id;
    const {fromMe, remote} = lastReceivedKey;
    const {pushname, isBusiness, isMyContact, profilePicThumbObj} = contact;

    console.log(`${pushname} - ${isMyContact ? 'Contato Salvo' : 'Não Salvo'} - ${archive ? 'Chat Arquivado' : 'Chat Aberto'} - ${isOnline ? 'On' : 'Off'}`);

    
};
//rascunho



function estaArquivado(obj) {
    return obj.archive;
};

function estaSalvo(obj) {
    const mContato = obj.contact
    const mIsMyContact = mContato.isMyContact;
    return mIsMyContact;
};

module.exports = chatObject;
module.exports = estaArquivado;
module.exports = estaSalvo;
