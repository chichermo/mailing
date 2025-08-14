import { NextRequest, NextResponse } from 'next/server'
import { getCollection } from '@/lib/db'

// POST - Importar listas de danza y contactos
export async function POST() {
  try {
    const contactsCollection = await getCollection('contacts')
    
    // Definir las listas de danza con sus contactos
    const danceLists = [
      {
        name: "Street Kids",
        contacts: [
          { firstName: "Andries", lastName: "Nanou", email: "lisa_verleye@hotmail.com" },
          { firstName: "Buyck", lastName: "Louise", email: "nathaliegoorix@hotmail.com" },
          { firstName: "Carton", lastName: "Enna", email: "melissamommens@hotmail.com" },
          { firstName: "Cattoor", lastName: "Lilly & Rose", email: "Info@lillyandrose.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "Debrabandere", lastName: "Floor", email: "instituutkelly@skynet.be" },
          { firstName: "Demey", lastName: "Charlotte", email: "mobouckingrid@hotmail.com" },
          { firstName: "Dijkstra", lastName: "Doutzen", email: "julie.brutein@gmail.com" },
          { firstName: "Duckaert", lastName: "Inaya", email: "buildingdiamonds1@gmail.com" },
          { firstName: "Geirnaert", lastName: "Célestine", email: "julieverbouw@outlook.com" },
          { firstName: "Impens", lastName: "Charlotte", email: "samencharlotte@telenet.be" },
          { firstName: "Landuyt", lastName: "Anne-Fleur", email: "sylviaverbouw@gmail.com" },
          { firstName: "Lemmens", lastName: "MacKenzie", email: "huysentruyt.maribel@gmail.com" },
          { firstName: "Louise", lastName: "Van Den Heuvel", email: "kristof@knokadvas.be" },
          { firstName: "MacKenzie", lastName: "oma", email: "Carole.scrivens@gmail.com" },
          { firstName: "Martens", lastName: "Jackie", email: "ellencallant@gmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" },
          { firstName: "Moeykens", lastName: "Aline", email: "alinemoeykens@icloud.com" },
          { firstName: "Oosters", lastName: "Renée", email: "anka_demulder@hotmail.com" },
          { firstName: "Smits", lastName: "Axelle", email: "kris.smits2@telenet.be" },
          { firstName: "Teirlynck", lastName: "Maïté", email: "els2308@gmail.com" },
          { firstName: "Valentin", lastName: "Livia", email: "belinda_incoul@hotmail.com" },
          { firstName: "Valentin", lastName: "Livia 2", email: "jeremyvalentin555@gmail.com" },
          { firstName: "Vandemoere", lastName: "Estelle", email: "evytje_moens@msn.com" },
          { firstName: "Vanden Poel", lastName: "Lara", email: "teodora.angelova22@gmail.com" },
          { firstName: "Vanden Poel", lastName: "Lara 2", email: "mathias.vandenpoel@icloud.com" },
          { firstName: "Vandertaelen", lastName: "Louise", email: "laikelitaer@hotmail.com" },
          { firstName: "Vanherweghe", lastName: "Romy", email: "deweerdtshirley@gmail.com" },
          { firstName: "Vansteenkiste", lastName: "Niene", email: "sarahdobbelaere@icloud.com" },
          { firstName: "Vansteenkiste", lastName: "Niene 2", email: "dries.vansteenkiste@telenet.be" },
          { firstName: "Vermander", lastName: "Babette", email: "jessiepoppe@hotmail.com" },
          { firstName: "Vermeersch", lastName: "Suzanne & Pauline", email: "tessafleerackers@hotmail.com" },
          { firstName: "Wittewrongel", lastName: "Ona", email: "christy.de.graeve@icloud.com" },
          { firstName: "Zelena", lastName: "Anastasiia", email: "olga@webdev.me" }
        ]
      },
      {
        name: "Street Teens",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Modern Kids",
        contacts: [
          { firstName: "Barnes", lastName: "Lily", email: "marjolijnrotsaert@hotmail.com" },
          { firstName: "Crombez", lastName: "Eline", email: "vermeirsch.m@gmail.com" },
          { firstName: "De Block", lastName: "Romy", email: "evy_verstrynge@hotmail.com" },
          { firstName: "De Groote", lastName: "Eline", email: "tamaralefevere@hotmail.com" },
          { firstName: "Deconinck", lastName: "Louise", email: "tine.kreps@telenet.be" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Naëlle", email: "magaliboedt@hotmail.com" },
          { firstName: "Eggericks", lastName: "Juliette", email: "vanderheydenkate@hotmail.com" },
          { firstName: "Elshout", lastName: "Anaïs", email: "w-elshout@hotmail.com" },
          { firstName: "Hertsens", lastName: "Elise", email: "sofiehertsens@hotmail.com" },
          { firstName: "Heylen", lastName: "Olivia", email: "joycedemey@telenet.be" },
          { firstName: "Hongenaert", lastName: "Amélie", email: "nathalie.beyen@skynet.be" },
          { firstName: "Kim", lastName: "De Clercq", email: "kimdeclercq81@gmail.com" },
          { firstName: "Martens", lastName: "Madeleine", email: "annemie.schepens@howest.be" },
          { firstName: "Miet", lastName: "Aarnouts", email: "miet_aarnouts@hotmail.com" },
          { firstName: "Opsomer", lastName: "Louise", email: "schiettecatte.nathalie@gmail.com" },
          { firstName: "Peeters", lastName: "Jenna", email: "kaat.lannoy@telenet.be" },
          { firstName: "Popelier", lastName: "Casey", email: "verbouwsandra@gmail.com" },
          { firstName: "Pyckavet", lastName: "Estelle", email: "tantefie2109@hotmail.com" },
          { firstName: "Vandamme", lastName: "Lucie", email: "sophie@interiorsbysophie.be" },
          { firstName: "Vandekerkhove", lastName: "Maud", email: "e.wintein@hotmail.com" }
        ]
      },
      {
        name: "Modern Teens",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Street 1",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Street 2_3",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Street 3_4",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Modern 1",
        contacts: [
          { firstName: "Barnes", lastName: "Lily", email: "marjolijnrotsaert@hotmail.com" },
          { firstName: "Crombez", lastName: "Eline", email: "vermeirsch.m@gmail.com" },
          { firstName: "De Block", lastName: "Romy", email: "evy_verstrynge@hotmail.com" },
          { firstName: "De Groote", lastName: "Eline", email: "tamaralefevere@hotmail.com" },
          { firstName: "Deconinck", lastName: "Louise", email: "tine.kreps@telenet.be" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Naëlle", email: "magaliboedt@hotmail.com" },
          { firstName: "Eggericks", lastName: "Juliette", email: "vanderheydenkate@hotmail.com" },
          { firstName: "Elshout", lastName: "Anaïs", email: "w-elshout@hotmail.com" },
          { firstName: "Hertsens", lastName: "Elise", email: "sofiehertsens@hotmail.com" },
          { firstName: "Heylen", lastName: "Olivia", email: "joycedemey@telenet.be" },
          { firstName: "Hongenaert", lastName: "Amélie", email: "nathalie.beyen@skynet.be" },
          { firstName: "Kim", lastName: "De Clercq", email: "kimdeclercq81@gmail.com" },
          { firstName: "Martens", lastName: "Madeleine", email: "annemie.schepens@howest.be" },
          { firstName: "Miet", lastName: "Aarnouts", email: "miet_aarnouts@hotmail.com" },
          { firstName: "Opsomer", lastName: "Louise", email: "schiettecatte.nathalie@gmail.com" },
          { firstName: "Peeters", lastName: "Jenna", email: "kaat.lannoy@telenet.be" },
          { firstName: "Popelier", lastName: "Casey", email: "verbouwsandra@gmail.com" },
          { firstName: "Pyckavet", lastName: "Estelle", email: "tantefie2109@hotmail.com" },
          { firstName: "Vandamme", lastName: "Lucie", email: "sophie@interiorsbysophie.be" },
          { firstName: "Vandekerkhove", lastName: "Maud", email: "e.wintein@hotmail.com" }
        ]
      },
      {
        name: "Modern 2_3",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Modern 3_4",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Volwassenen",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      },
      {
        name: "Mini's",
        contacts: [
          { firstName: "Baelen", lastName: "Lotte", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 2", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 3", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 4", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 5", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 6", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 7", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 8", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 9", email: "lotte.baelen@hotmail.com" },
          { firstName: "Baelen", lastName: "Lotte 10", email: "lotte.baelen@hotmail.com" }
        ]
      }
    ]

    let totalContactsCreated = 0
    let totalContactsUpdated = 0
    const errors: string[] = []

    // Procesar cada lista
    for (const list of danceLists) {
      console.log(`Processing list: ${list.name}`)
      
      for (const contactData of list.contacts) {
        try {
          // Verificar si el contacto ya existe
          const existingContact = await contactsCollection.findOne({ 
            email: contactData.email 
          })

          if (existingContact) {
            // Si existe, agregar la nueva lista a listNames
            await contactsCollection.updateOne(
              { _id: existingContact._id },
              { 
                $addToSet: { listNames: list.name } // Agregar lista sin duplicados
              }
            )
            totalContactsUpdated++
            console.log(`Updated contact: ${contactData.email} - added to ${list.name}`)
          } else {
            // Si no existe, crear nuevo contacto
            const newContact = {
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              email: contactData.email,
              company: '',
              phone: '',
              listNames: [list.name],
              createdAt: new Date()
            }

            await contactsCollection.insertOne(newContact)
            totalContactsCreated++
            console.log(`Created contact: ${contactData.email} in ${list.name}`)
          }
        } catch (error) {
          const errorMsg = `Error processing ${contactData.email}: ${error}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed successfully`,
      summary: {
        listsProcessed: danceLists.length,
        contactsCreated: totalContactsCreated,
        contactsUpdated: totalContactsUpdated,
        errors: errors.length
      },
      errors: errors
    })

  } catch (error) {
    console.error('Error during import:', error)
    return NextResponse.json(
      { success: false, error: 'Error during import' },
      { status: 500 }
    )
  }
}
