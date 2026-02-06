import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Importar listas de danza con datos reales hardcodeados
export async function POST() {
  try {
    // LIMPIAR BASE DE DATOS ANTES DE IMPORTAR
    console.log('🧹 Limpiando base de datos...')
    const { error: deleteError } = await supabaseAdmin
      .from('contacts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      throw deleteError
    }
    console.log('✅ Base de datos limpiada')
    
    // Datos reales basados en los archivos que tienes
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
          { firstName: "Baeckelandt", lastName: "Enora", email: "wijnepatricia@gmail.com" },
          { firstName: "Baert", lastName: "Amy", email: "sarah_roelandt@hotmail.com" },
          { firstName: "Brouckaert", lastName: "Emma en Liana", email: "demeesterkim@hotmail.com" },
          { firstName: "Coppejans", lastName: "Dieuwke", email: "johnnycoppejans@hotmail.com" },
          { firstName: "De Coussemaker", lastName: "Emilia", email: "kurt.cheryl@telenet.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Loena", email: "saradeleener@telenet.be" },
          { firstName: "Desmidt", lastName: "Chiara", email: "melanievangheluwe@icloud.com" },
          { firstName: "Desmidt", lastName: "Dante", email: "fre_desmidt@hotmail.com" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Noëlie", email: "magaliboedt@hotmail.com" },
          { firstName: "Filisia", lastName: "Tamsin", email: "kasiafilisia@gmail.com" },
          { firstName: "Geraci", lastName: "Julie", email: "giuliageraci@hotmail.com" },
          { firstName: "kreps", lastName: "Gigi", email: "liesbethkreps@gmail.com" },
          { firstName: "Leemans", lastName: "Jorbe", email: "kurzieboy@hotmail.com" },
          { firstName: "Lierman", lastName: "Anaïs", email: "rebecca_Maelfeyt@hotmail.com" },
          { firstName: "Mareydt", lastName: "Marie-Lou", email: "tommareydt@hotmail.com" },
          { firstName: "Marley", lastName: "Leuntjens", email: "anke.dekee@knokke-heist.be" },
          { firstName: "Meyers", lastName: "Alexie", email: "welvaertjanice@hotmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" },
          { firstName: "Ouders Vossen", lastName: "Elle", email: "sylvie_cantraine@yahoo.com" },
          { firstName: "Patteet", lastName: "Charlotte", email: "cverstraaten@hotmail.com" },
          { firstName: "Peeters", lastName: "Lee-Ann", email: "kaat.lannoy@outlook.com" },
          { firstName: "Sarah", lastName: "Deputter", email: "sdeputter@icloud.com" },
          { firstName: "Savels", lastName: "Elsie", email: "Moens_Tamara@hotmail.com" },
          { firstName: "Savels", lastName: "Lise", email: "kellefleerackers@hotmail.com" },
          { firstName: "Van Biervliet", lastName: "Gaëlle", email: "caroline.goeminne@telenet.be" },
          { firstName: "Vandierendonck", lastName: "Kate", email: "devoogtannelies@gmail.com" },
          { firstName: "Vansteenkiste", lastName: "Niene", email: "sarahdobbelaere@icloud.com" },
          { firstName: "Vansteenkiste", lastName: "Niene 2", email: "dries.vansteenkiste@telenet.be" },
          { firstName: "Verlinde", lastName: "Fleur", email: "heikedeweerdt@gmail.com" },
          { firstName: "Wasnaire", lastName: "Fay", email: "lizzy.litaer@gmail.com" }
        ]
      },
      {
        name: "Modern Kids",
        contacts: [
          { firstName: "Aarnouts", lastName: "Miet", email: "miet_aarnouts@hotmail.com" },
          { firstName: "Andries", lastName: "Nanou", email: "lisa_verleye@hotmail.com" },
          { firstName: "Buyck", lastName: "Louise", email: "nathaliegoorix@hotmail.com" },
          { firstName: "Carton", lastName: "Enna", email: "melissamommens@hotmail.com" },
          { firstName: "Cattoor", lastName: "Lilly & Rose", email: "Info@lillyandrose.be" },
          { firstName: "De Jaeghere", lastName: "Olivia", email: "samencharlotte@telenet.be" },
          { firstName: "De Paep", lastName: "Lieke", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Laïs", email: "kimmareydt@hotmail.com" },
          { firstName: "Debrabandere", lastName: "Floor", email: "instituutkelly@skynet.be" },
          { firstName: "Demey", lastName: "Charlotte", email: "mobouckingrid@hotmail.com" },
          { firstName: "Dijkstra", lastName: "Doutzen", email: "julie.brutein@gmail.com" },
          { firstName: "Duckaert", lastName: "Inaya", email: "buildingdiamonds1@gmail.com" },
          { firstName: "Landuyt", lastName: "Anne-Fleur", email: "sylviaverbouw@gmail.com" },
          { firstName: "Lily", lastName: "Trenson", email: "stefanieterryn@hotmail.com" },
          { firstName: "Louise", lastName: "Van Den Heuvel", email: "kristof@knokadvas.be" },
          { firstName: "Mainil", lastName: "Cilou", email: "lies-eeckeloo@hotmail.be" },
          { firstName: "Oosterss", lastName: "Renée", email: "anka_demulder@hotmail.com" },
          { firstName: "Smits", lastName: "Axelle", email: "kris.smits2@telenet.be" },
          { firstName: "Teirlynck", lastName: "Maïté", email: "els2308@gmail.com" },
          { firstName: "Valentin", lastName: "Livia", email: "belinda_incoul@hotmail.com" },
          { firstName: "Valentin", lastName: "Livia 2", email: "jeremyvalentin555@gmail.com" },
          { firstName: "Vandemoere", lastName: "Estelle", email: "evytje_moens@msn.com" },
          { firstName: "Vanden Poel", lastName: "Lara", email: "teodora.angelova22@gmail.com" },
          { firstName: "Vanden Poel", lastName: "Lara 2", email: "mathias.vandenpoel@icloud.com" },
          { firstName: "Vanherweghe", lastName: "Romy", email: "deweerdtshirley@gmail.com" },
          { firstName: "Verdruye", lastName: "Ella-Lise", email: "delphine.jacobs1@gmail.com" },
          { firstName: "Walravens", lastName: "Kato", email: "sylvietilmans@hotmail.com" },
          { firstName: "Watteeuw", lastName: "Aurélie", email: "hanne.eeckeloo@hotmail.be" },
          { firstName: "Wittewrongel", lastName: "Ona", email: "christy.de.graeve@icloud.com" }
        ]
      },
      {
        name: "Modern Teens",
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
        name: "Street 1",
        contacts: [
          { firstName: "Baeckelandt", lastName: "Enora", email: "wijnepatricia@gmail.com" },
          { firstName: "Baert", lastName: "Amy", email: "sarah_roelandt@hotmail.com" },
          { firstName: "Brouckaert", lastName: "Emma en Liana", email: "demeesterkim@hotmail.com" },
          { firstName: "Coppejans", lastName: "Dieuwke", email: "johnnycoppejans@hotmail.com" },
          { firstName: "De Coussemaker", lastName: "Emilia", email: "kurt.cheryl@telenet.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Loena", email: "saradeleener@telenet.be" },
          { firstName: "Desmidt", lastName: "Chiara", email: "melanievangheluwe@icloud.com" },
          { firstName: "Desmidt", lastName: "Dante", email: "fre_desmidt@hotmail.com" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Noëlie", email: "magaliboedt@hotmail.com" },
          { firstName: "Filisia", lastName: "Tamsin", email: "kasiafilisia@gmail.com" },
          { firstName: "Geraci", lastName: "Julie", email: "giuliageraci@hotmail.com" },
          { firstName: "kreps", lastName: "Gigi", email: "liesbethkreps@gmail.com" },
          { firstName: "Leemans", lastName: "Jorbe", email: "kurzieboy@hotmail.com" },
          { firstName: "Lierman", lastName: "Anaïs", email: "rebecca_Maelfeyt@hotmail.com" },
          { firstName: "Mareydt", lastName: "Marie-Lou", email: "tommareydt@hotmail.com" },
          { firstName: "Marley", lastName: "Leuntjens", email: "anke.dekee@knokke-heist.be" },
          { firstName: "Meyers", lastName: "Alexie", email: "welvaertjanice@hotmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" },
          { firstName: "Ouders Vossen", lastName: "Elle", email: "sylvie_cantraine@yahoo.com" },
          { firstName: "Patteet", lastName: "Charlotte", email: "cverstraaten@hotmail.com" },
          { firstName: "Peeters", lastName: "Lee-Ann", email: "kaat.lannoy@outlook.com" },
          { firstName: "Sarah", lastName: "Deputter", email: "sdeputter@icloud.com" },
          { firstName: "Savels", lastName: "Elsie", email: "Moens_Tamara@hotmail.com" },
          { firstName: "Savels", lastName: "Lise", email: "kellefleerackers@hotmail.com" },
          { firstName: "Van Biervliet", lastName: "Gaëlle", email: "caroline.goeminne@telenet.be" },
          { firstName: "Vandierendonck", lastName: "Kate", email: "devoogtannelies@gmail.com" },
          { firstName: "Vansteenkiste", lastName: "Niene", email: "sarahdobbelaere@icloud.com" },
          { firstName: "Vansteenkiste", lastName: "Niene 2", email: "dries.vansteenkiste@telenet.be" },
          { firstName: "Verlinde", lastName: "Fleur", email: "heikedeweerdt@gmail.com" },
          { firstName: "Wasnaire", lastName: "Fay", email: "lizzy.litaer@gmail.com" }
        ]
      },
      {
        name: "Street 2_3",
        contacts: [
          { firstName: "Baeckelandt", lastName: "Enora", email: "wijnepatricia@gmail.com" },
          { firstName: "Baert", lastName: "Amy", email: "sarah_roelandt@hotmail.com" },
          { firstName: "Brouckaert", lastName: "Emma en Liana", email: "demeesterkim@hotmail.com" },
          { firstName: "Coppejans", lastName: "Dieuwke", email: "johnnycoppejans@hotmail.com" },
          { firstName: "De Coussemaker", lastName: "Emilia", email: "kurt.cheryl@telenet.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Loena", email: "saradeleener@telenet.be" },
          { firstName: "Desmidt", lastName: "Chiara", email: "melanievangheluwe@icloud.com" },
          { firstName: "Desmidt", lastName: "Dante", email: "fre_desmidt@hotmail.com" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Noëlie", email: "magaliboedt@hotmail.com" },
          { firstName: "Filisia", lastName: "Tamsin", email: "kasiafilisia@gmail.com" },
          { firstName: "Geraci", lastName: "Julie", email: "giuliageraci@hotmail.com" },
          { firstName: "kreps", lastName: "Gigi", email: "liesbethkreps@gmail.com" },
          { firstName: "Leemans", lastName: "Jorbe", email: "kurzieboy@hotmail.com" },
          { firstName: "Lierman", lastName: "Anaïs", email: "rebecca_Maelfeyt@hotmail.com" },
          { firstName: "Mareydt", lastName: "Marie-Lou", email: "tommareydt@hotmail.com" },
          { firstName: "Marley", lastName: "Leuntjens", email: "anke.dekee@knokke-heist.be" },
          { firstName: "Meyers", lastName: "Alexie", email: "welvaertjanice@hotmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" },
          { firstName: "Ouders Vossen", lastName: "Elle", email: "sylvie_cantraine@yahoo.com" },
          { firstName: "Patteet", lastName: "Charlotte", email: "cverstraaten@hotmail.com" },
          { firstName: "Peeters", lastName: "Lee-Ann", email: "kaat.lannoy@outlook.com" },
          { firstName: "Sarah", lastName: "Deputter", email: "sdeputter@icloud.com" },
          { firstName: "Savels", lastName: "Elsie", email: "Moens_Tamara@hotmail.com" },
          { firstName: "Savels", lastName: "Lise", email: "kellefleerackers@hotmail.com" },
          { firstName: "Van Biervliet", lastName: "Gaëlle", email: "caroline.goeminne@telenet.be" },
          { firstName: "Vandierendonck", lastName: "Kate", email: "devoogtannelies@gmail.com" },
          { firstName: "Vansteenkiste", lastName: "Niene", email: "sarahdobbelaere@icloud.com" },
          { firstName: "Vansteenkiste", lastName: "Niene 2", email: "dries.vansteenkiste@telenet.be" },
          { firstName: "Verlinde", lastName: "Fleur", email: "heikedeweerdt@gmail.com" },
          { firstName: "Wasnaire", lastName: "Fay", email: "lizzy.litaer@gmail.com" }
        ]
      },
      {
        name: "Street 3_4",
        contacts: [
          { firstName: "Baeckelandt", lastName: "Enora", email: "wijnepatricia@gmail.com" },
          { firstName: "Baert", lastName: "Amy", email: "sarah_roelandt@hotmail.com" },
          { firstName: "Brouckaert", lastName: "Emma en Liana", email: "demeesterkim@hotmail.com" },
          { firstName: "Coppejans", lastName: "Dieuwke", email: "johnnycoppejans@hotmail.com" },
          { firstName: "De Coussemaker", lastName: "Emilia", email: "kurt.cheryl@telenet.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Loena", email: "saradeleener@telenet.be" },
          { firstName: "Desmidt", lastName: "Chiara", email: "melanievangheluwe@icloud.com" },
          { firstName: "Desmidt", lastName: "Dante", email: "fre_desmidt@hotmail.com" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Noëlie", email: "magaliboedt@hotmail.com" },
          { firstName: "Filisia", lastName: "Tamsin", email: "kasiafilisia@gmail.com" },
          { firstName: "Geraci", lastName: "Julie", email: "giuliageraci@hotmail.com" },
          { firstName: "kreps", lastName: "Gigi", email: "liesbethkreps@gmail.com" },
          { firstName: "Leemans", lastName: "Jorbe", email: "kurzieboy@hotmail.com" },
          { firstName: "Lierman", lastName: "Anaïs", email: "rebecca_Maelfeyt@hotmail.com" },
          { firstName: "Mareydt", lastName: "Marie-Lou", email: "tommareydt@hotmail.com" },
          { firstName: "Marley", lastName: "Leuntjens", email: "anke.dekee@knokke-heist.be" },
          { firstName: "Meyers", lastName: "Alexie", email: "welvaertjanice@hotmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" }
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
        name: "Modern 3_4",
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
          { firstName: "Pyckavet", lastName: "Estelle", email: "tantefie2109@hotmail.com" }
        ]
      },
      {
        name: "Volwassenen",
        contacts: [
          { firstName: "Baeckelandt", lastName: "Enora", email: "wijnepatricia@gmail.com" },
          { firstName: "Baert", lastName: "Amy", email: "sarah_roelandt@hotmail.com" },
          { firstName: "Brouckaert", lastName: "Emma en Liana", email: "demeesterkim@hotmail.com" },
          { firstName: "Coppejans", lastName: "Dieuwke", email: "johnnycoppejans@hotmail.com" },
          { firstName: "De Coussemaker", lastName: "Emilia", email: "kurt.cheryl@telenet.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Loena", email: "saradeleener@telenet.be" },
          { firstName: "Desmidt", lastName: "Chiara", email: "melanievangheluwe@icloud.com" },
          { firstName: "Desmidt", lastName: "Dante", email: "fre_desmidt@hotmail.com" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Noëlie", email: "magaliboedt@hotmail.com" },
          { firstName: "Filisia", lastName: "Tamsin", email: "kasiafilisia@gmail.com" },
          { firstName: "Geraci", lastName: "Julie", email: "giuliageraci@hotmail.com" },
          { firstName: "kreps", lastName: "Gigi", email: "liesbethkreps@gmail.com" },
          { firstName: "Leemans", lastName: "Jorbe", email: "kurzieboy@hotmail.com" },
          { firstName: "Lierman", lastName: "Anaïs", email: "rebecca_Maelfeyt@hotmail.com" },
          { firstName: "Mareydt", lastName: "Marie-Lou", email: "tommareydt@hotmail.com" },
          { firstName: "Marley", lastName: "Leuntjens", email: "anke.dekee@knokke-heist.be" },
          { firstName: "Meyers", lastName: "Alexie", email: "welvaertjanice@hotmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" },
          { firstName: "Ouders Vossen", lastName: "Elle", email: "sylvie_cantraine@yahoo.com" },
          { firstName: "Patteet", lastName: "Charlotte", email: "cverstraaten@hotmail.com" },
          { firstName: "Peeters", lastName: "Lee-Ann", email: "kaat.lannoy@outlook.com" },
          { firstName: "Sarah", lastName: "Deputter", email: "sdeputter@icloud.com" },
          { firstName: "Savels", lastName: "Elsie", email: "Moens_Tamara@hotmail.com" },
          { firstName: "Savels", lastName: "Lise", email: "kellefleerackers@hotmail.com" },
          { firstName: "Van Biervliet", lastName: "Gaëlle", email: "caroline.goeminne@telenet.be" },
          { firstName: "Vandierendonck", lastName: "Kate", email: "devoogtannelies@gmail.com" },
          { firstName: "Vansteenkiste", lastName: "Niene", email: "sarahdobbelaere@icloud.com" },
          { firstName: "Vansteenkiste", lastName: "Niene 2", email: "dries.vansteenkiste@telenet.be" },
          { firstName: "Verlinde", lastName: "Fleur", email: "heikedeweerdt@gmail.com" },
          { firstName: "Wasnaire", lastName: "Fay", email: "lizzy.litaer@gmail.com" }
        ]
      },
      {
        name: "Mini's",
        contacts: [
          { firstName: "Baeckelandt", lastName: "Enora", email: "wijnepatricia@gmail.com" },
          { firstName: "Baert", lastName: "Amy", email: "sarah_roelandt@hotmail.com" },
          { firstName: "Brouckaert", lastName: "Emma en Liana", email: "demeesterkim@hotmail.com" },
          { firstName: "Coppejans", lastName: "Dieuwke", email: "johnnycoppejans@hotmail.com" },
          { firstName: "De Coussemaker", lastName: "Emilia", email: "kurt.cheryl@telenet.be" },
          { firstName: "De Paep", lastName: "Louna", email: "sarahds1985@gmail.com" },
          { firstName: "De Schuyter", lastName: "Loena", email: "saradeleener@telenet.be" },
          { firstName: "Desmidt", lastName: "Chiara", email: "melanievangheluwe@icloud.com" },
          { firstName: "Desmidt", lastName: "Dante", email: "fre_desmidt@hotmail.com" },
          { firstName: "Devisch", lastName: "Yliana", email: "melissa_lamote@hotmail.com" },
          { firstName: "Dobbelaere", lastName: "Noëlie", email: "magaliboedt@hotmail.com" },
          { firstName: "Filisia", lastName: "Tamsin", email: "kasiafilisia@gmail.com" },
          { firstName: "Geraci", lastName: "Julie", email: "giuliageraci@hotmail.com" },
          { firstName: "kreps", lastName: "Gigi", email: "liesbethkreps@gmail.com" },
          { firstName: "Leemans", lastName: "Jorbe", email: "kurzieboy@hotmail.com" },
          { firstName: "Lierman", lastName: "Anaïs", email: "rebecca_Maelfeyt@hotmail.com" },
          { firstName: "Mareydt", lastName: "Marie-Lou", email: "tommareydt@hotmail.com" },
          { firstName: "Marley", lastName: "Leuntjens", email: "anke.dekee@knokke-heist.be" },
          { firstName: "Meyers", lastName: "Alexie", email: "welvaertjanice@hotmail.com" },
          { firstName: "Meyers", lastName: "Elise", email: "shana.moyaert@hotmail.com" },
          { firstName: "Ouders Vossen", lastName: "Elle", email: "sylvie_cantraine@yahoo.com" },
          { firstName: "Patteet", lastName: "Charlotte", email: "cverstraaten@hotmail.com" },
          { firstName: "Peeters", lastName: "Lee-Ann", email: "kaat.lannoy@outlook.com" }
        ]
      }
    ]

    console.log(`📊 Total de listas a procesar: ${danceLists.length}`)
    console.log(`📋 Nombres de las listas:`, danceLists.map(l => l.name))

    let totalContactsCreated = 0
    const errors: string[] = []
    const processedLists: string[] = []

    // Procesar cada lista
    for (const list of danceLists) {
      try {
        console.log(`📋 Procesando lista: ${list.name}`)
        console.log(`👥 Contactos en ${list.name}: ${list.contacts.length}`)

        // Procesar contactos de esta lista
        for (const contactData of list.contacts) {
          try {
            // Verificar si el contacto ya existe
            const { data: existingContact, error: existingError } = await supabaseAdmin
              .from('contacts')
              .select('id,list_names')
              .eq('email', contactData.email)
              .maybeSingle()

            if (existingError) {
              throw existingError
            }
            
            if (existingContact) {
              // Actualizar el contacto existente agregando la nueva lista
              const updatedListNames = [...(existingContact.list_names || []), list.name]
              const uniqueListNames = Array.from(new Set(updatedListNames)) // Eliminar duplicados
              
              const { error: updateError } = await supabaseAdmin
                .from('contacts')
                .update({ list_names: uniqueListNames })
                .eq('id', existingContact.id)

              if (updateError) {
                throw updateError
              }
              console.log(`🔄 Actualizado: ${contactData.email} agregado a ${list.name}`)
            } else {
              // Crear nuevo contacto con email original
              const newContact = {
                first_name: contactData.firstName,
                last_name: contactData.lastName,
                email: contactData.email,
                company: '',
                phone: '',
                list_names: [list.name],
                created_at: new Date().toISOString()
              }
          
              const { error: insertError } = await supabaseAdmin
                .from('contacts')
                .insert(newContact)

              if (insertError) {
                throw insertError
              }
              totalContactsCreated++
              console.log(`🆕 Creado: ${contactData.email} en ${list.name}`)
            }
          } catch (error) {
            const errorMsg = `Error procesando ${contactData.email}: ${error}`
            console.error(errorMsg)
            errors.push(errorMsg)
          }
        }

        processedLists.push(list.name)
        console.log(`✅ Lista ${list.name} procesada exitosamente`)

      } catch (error) {
        const errorMsg = `Error procesando lista ${list.name}: ${error}`
        console.error(errorMsg)
        errors.push(errorMsg)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Import completed successfully',
      summary: {
        listsProcessed: processedLists.length,
        contactsCreated: totalContactsCreated,
        errors: errors.length
      },
      processedLists: processedLists,
      errors: errors
    })

  } catch (error) {
    console.error('Error durante la importación:', error)
    return NextResponse.json(
      { success: false, error: `Import error: ${error}` },
      { status: 500 }
    )
  }
}
