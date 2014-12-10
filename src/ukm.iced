
pgp = require './openpgp/keymanager'
kb = require './keybase/keymanager'

#==========================================================================

# Import a public key either in KB or OpenPGP form,
# and allocate the correct KeyManager as a result.
exports.import_armored_public = ({armored}, cb) ->
  if armored.match /^-{5}BEGIN PGP PUBLIC KEY BLOCK-{5}/
    await pgp.KeyManager.import_from_armored_pgp { armored }, defer err, ret, warnings
  else
    await kb.KeyManager.import_public { hex : armored }, defer err, ret
  cb err, ret

#==========================================================================

