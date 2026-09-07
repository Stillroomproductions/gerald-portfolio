import type {StructureResolver} from 'sanity/structure'

/** Document types that exist exactly once and are edited in place. */
export const singletonTypes = new Set(['siteSettings'])
/** The fixed document ids those singletons live at. */
export const singletonIds = new Set(['siteSettings'])

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Site Settings is a single document, so link straight to it rather than
      // showing a list the editor could add a second entry to.
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() as string)
      ),
    ])
