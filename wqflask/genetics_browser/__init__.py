import functools

from flask import Blueprint

genetics_browser = Blueprint('genetics_browser', __name__,
                             template_folder='templates')

def bd_track(name, desc):
    conf = {}
    conf['trackType'] = 'BDTrack'
    conf['name'] = name
    conf['desc'] = desc
    return conf

def multi_track(name, desc=""):
    conf = bd_track(name, desc)
    conf['tier_type'] = 'multi'
    conf['renderer'] = 'multi'
    # TODO: should the grid be configurable?
    multi = {'multi_id': name,
             'grid': True,
             'grid_offset': 0,
             'grid_spacing': 10}
    conf['multi'] = multi
    return conf

def set_sub_track(track, multi_config, offset, z):
    sub = {'multi_id': multi_config['multi']['multi_id'],
           'offset': offset,
           'z': z}
    track['hidden'] = True
    track['sub'] = sub
    if 'renderer' not in track:
        track['renderer'] = 'sub'

def genome_track(name, uri, desc=""):
    conf = bd_track(name, desc)
    conf['twoBitURI'] = uri
    conf['desc'] = 'Mouse reference genome build GRCm38'
    conf['tier_type'] = 'sequence'
    conf['provides_entrypoints'] = True
    return conf

def qtl_track(name, uri, desc=""):
    conf = bd_track(name, desc)
    conf['uri'] = uri
    conf['tier_type'] = 'qtl'
    conf['renderer'] = 'qtlRenderer'
    return conf

def gwas_track(name, uri, desc=""):
    conf = bd_track(name, desc)
    conf['bwgURI'] = uri
    conf['forceReduction'] = -1
    conf['renderer'] = 'gwasRenderer'
    return conf

def snp_track(name, uri, desc=""):
    conf = bd_track(name, desc)
    conf['jbURI'] = uri
    conf['jbQuery'] = ""
    style = {'type': 'default',
             'style': {'glyph': 'HISTOGRAM',
                       'MIN': 0.0,
                       'MAX': 1000,
                       'AUTOMAX': 'yes',
                       'AXISCENTER': 'yes',
                       'STEPS': 500,
                       'HIDEAXISLABEL': 'yes',
                       'COLOR1': 'red',
                       'COLOR2': 'red',
                       'COLOR3': 'red',
                       'HEIGHT': 120}}
    conf['style'] = [style]
    conf['refetchOnZoom'] = True
    return conf

def gene_track(name, bwgURI, trixURI, desc=""):
    conf = bd_track(name, desc)
    conf['bwgURI'] = bwgURI
    conf['trixURI'] = trixURI
    conf['stylesheet_uri'] = 'http://www.biodalliance.org/datasets/GRCm38/gencodeM2.bb'
    conf['collapseSuperGroups'] = True
    return conf
